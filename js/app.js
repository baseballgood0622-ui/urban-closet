/**
 * ============================================================================
 * URBAN CLOSET（アーバンクローゼット）公式オンラインストア 共通アプリケーションJS
 * ファイル名: js/app.js
 * ----------------------------------------------------------------------------
 * 【初心者向けガイド】
 * ・全6ページ共通の動き（メニュー開閉、リアルタイム商品検索、右スライド式ミニカート、
 *   ニュースレター登録、利用規約・プライバシーポリシー表示、画像エラー保護）と、
 *   各ページ固有の動き（絞り込み・並び替え、商品詳細切替、ルックブック拡大、フォーム検証）
 *   をこのファイルでまとめて制御しています。
 * ============================================================================
 */

(function () {
  'use strict';

  /* ==========================================================================
   * 0. 画像読み込み失敗時のミニマルSVGフォールバック（リンク切れバツ印を完全防止）
   * ========================================================================== */
  const FALLBACK_SVG_URI =
    'data:image/svg+xml;charset=UTF-8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">' +
        '<rect width="600" height="800" fill="#F9FAFB"/>' +
        '<rect x="24" y="24" width="552" height="752" fill="none" stroke="#0A0A0A" stroke-opacity="0.08" stroke-width="1"/>' +
        '<path d="M300 345 a14 14 0 0 1 14 14 c0 10 -14 14 -14 24 m0 0 l-72 42 h144 z" fill="none" stroke="#6B7280" stroke-width="1.5" stroke-linecap="square"/>' +
        '<text x="300" y="462" text-anchor="middle" font-family="Helvetica Neue, Inter, Arial, sans-serif" font-size="13" font-weight="400" letter-spacing="5" fill="#0A0A0A">URBAN CLOSET</text>' +
        '<text x="300" y="486" text-anchor="middle" font-family="Helvetica Neue, Inter, Arial, sans-serif" font-size="10" font-weight="300" letter-spacing="3" fill="#6B7280">ARCHITECTURAL ARCHIVE</text>' +
      '</svg>'
    );

  document.addEventListener(
    'error',
    function (event) {
      const target = event.target;
      if (target && target.tagName === 'IMG' && !target.dataset.fallbackApplied) {
        target.dataset.fallbackApplied = 'true';
        target.src = FALLBACK_SVG_URI;
      }
    },
    true
  );

  /* ==========================================================================
   * 1. マスターデータ参照＆共通ヘルパー関数
   * ========================================================================== */
  const DATA = window.URBAN_CLOSET_DATA || { config: {}, products: [], lookbook: [], newArrivalIds: [] };
  const PRODUCTS = DATA.products || [];
  const LOOKBOOK = DATA.lookbook || [];
  const FREE_SHIPPING_THRESHOLD = (DATA.config && DATA.config.freeShippingThreshold) || 15000;
  const CART_STORAGE_KEY = 'urban_closet_cart_v1';

  // メモリ上の予備カート（プライベートブラウジング等でlocalStorageが使えない環境用）
  let memoryCartFallback = [];

  /** 数値を「¥12,000」形式にフォーマット */
  function formatPrice(num) {
    return '¥' + Number(num || 0).toLocaleString('ja-JP');
  }

  /** 安全なHTMLエスケープ */
  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** IDから商品オブジェクトを検索 */
  function findProductById(id) {
    return PRODUCTS.find(function (p) {
      return p.id === id;
    });
  }

  /**
   * 共通：商品カードHTMLを生成（NEW ARRIVALS / PRODUCTS / RELATED 共通）
   * ★ブランド名・商品名・価格を表示し、ホバー時に2枚目画像へフェード切替
   */
  function createProductCardHTML(product) {
    const imgPrimary = product.images[0] || FALLBACK_SVG_URI;
    const imgHover = product.images[1] || imgPrimary;
    return (
      '<a href="product.html?id=' + encodeURIComponent(product.id) + '" class="product-card" data-product-id="' + escapeHtml(product.id) + '">' +
        '<div class="product-card__media">' +
          '<img src="' + escapeHtml(imgPrimary) + '" alt="' + escapeHtml(product.name) + '" class="product-card__img product-card__img--primary" decoding="async">' +
          '<img src="' + escapeHtml(imgHover) + '" alt="' + escapeHtml(product.name) + ' 着用イメージ" class="product-card__img product-card__img--hover" loading="lazy" decoding="async">' +
        '</div>' +
        '<div class="product-card__body">' +
          '<div class="product-card__top-meta">' +
            '<span class="product-card__brand">' + escapeHtml(product.brand) + '</span>' +
            '<span class="product-card__category">' + escapeHtml(product.category) + '</span>' +
          '</div>' +
          '<h3 class="product-card__name ja-heading">' + escapeHtml(product.name) + '</h3>' +
          '<div class="product-card__bottom">' +
            '<span class="product-card__price">' + formatPrice(product.price) + '</span>' +
            '<span class="product-card__swatches" aria-label="展開カラー: Black, White, Gray">' +
              '<span class="swatch-dot swatch-dot--black"></span>' +
              '<span class="swatch-dot swatch-dot--white"></span>' +
              '<span class="swatch-dot swatch-dot--gray"></span>' +
            '</span>' +
          '</div>' +
        '</div>' +
      '</a>'
    );
  }

  /* ==========================================================================
   * 2. カート状態管理（localStorage 永続化 ＆ 右スライド式ミニカート描画）
   * ========================================================================== */
  function loadCart() {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return memoryCartFallback.slice();
    }
  }

  function saveCart(cartItems) {
    memoryCartFallback = cartItems.slice();
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      // ストレージ制限環境でもメモリ上で継続動作
    }
  }

  function getCartTotalCount(cartItems) {
    return cartItems.reduce(function (sum, item) {
      return sum + (Number(item.quantity) || 0);
    }, 0);
  }

  function getCartSubtotal(cartItems) {
    return cartItems.reduce(function (sum, item) {
      const product = findProductById(item.productId);
      const price = product ? product.price : Number(item.price) || 0;
      return sum + price * (Number(item.quantity) || 0);
    }, 0);
  }

  /** ミニカートUIとヘッダーバッジを最新状態に再描画 */
  function renderCartUI() {
    const cart = loadCart();
    const totalCount = getCartTotalCount(cart);
    const subtotal = getCartSubtotal(cart);

    // ヘッダー内バッジ更新
    document.querySelectorAll('.js-cart-count').forEach(function (el) {
      el.textContent = String(totalCount);
    });

    // ドロワータイトル内の点数更新
    const drawerCountEl = document.getElementById('cartDrawerCount');
    if (drawerCountEl) {
      drawerCountEl.textContent = String(totalCount);
    }

    // 送料無料ステータスバー更新
    const shippingTextEl = document.getElementById('cartShippingText');
    const shippingFillEl = document.getElementById('cartShippingFill');
    if (shippingTextEl && shippingFillEl) {
      if (subtotal === 0) {
        shippingTextEl.textContent = '¥15,000（税込）以上のお買い上げで国内送料無料';
        shippingFillEl.style.width = '0%';
      } else if (subtotal < FREE_SHIPPING_THRESHOLD) {
        const diff = FREE_SHIPPING_THRESHOLD - subtotal;
        const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
        shippingTextEl.textContent = 'あと ' + formatPrice(diff) + ' のお買い上げで国内送料無料';
        shippingFillEl.style.width = pct + '%';
      } else {
        shippingTextEl.textContent = '国内送料無料の対象です（FREE SHIPPING APPLIED）';
        shippingFillEl.style.width = '100%';
      }
    }

    // カート内アイテムリスト描画
    const cartBodyEl = document.getElementById('cartDrawerBody');
    const cartFooterEl = document.getElementById('cartDrawerFooter');
    const cartSubtotalEl = document.getElementById('cartSubtotalAmount');

    if (!cartBodyEl) return;

    if (cart.length === 0) {
      cartBodyEl.innerHTML =
        '<div class="cart-empty">' +
          '<p class="cart-empty__title">カートに商品が入っていません。</p>' +
          '<p class="cart-empty__sub">2025 SPRING COLLECTIONの新作アイテムをご覧ください。</p>' +
          '<a href="products.html" class="btn-primary">SHOP PRODUCTS</a>' +
        '</div>';
      if (cartFooterEl) cartFooterEl.style.display = 'none';
    } else {
      cartBodyEl.innerHTML = cart
        .map(function (item, idx) {
          const product = findProductById(item.productId);
          const name = product ? product.name : item.name || 'ITEM';
          const brand = product ? product.brand : 'URBAN CLOSET';
          const price = product ? product.price : item.price || 0;
          const img = product && product.images[0] ? product.images[0] : FALLBACK_SVG_URI;
          return (
            '<div class="cart-item" data-cart-index="' + idx + '">' +
              '<a href="product.html?id=' + encodeURIComponent(item.productId) + '">' +
                '<img src="' + escapeHtml(img) + '" alt="' + escapeHtml(name) + '" class="cart-item__img">' +
              '</a>' +
              '<div class="cart-item__info">' +
                '<div>' +
                  '<div class="cart-item__brand">' + escapeHtml(brand) + '</div>' +
                  '<a href="product.html?id=' + encodeURIComponent(item.productId) + '" class="cart-item__name">' + escapeHtml(name) + '</a>' +
                  '<div class="cart-item__variant">Color: ' + escapeHtml(item.color) + ' / Size: ' + escapeHtml(item.size) + '</div>' +
                  '<div class="cart-item__price">' + formatPrice(price * item.quantity) + '</div>' +
                '</div>' +
                '<div class="cart-item__actions">' +
                  '<div class="qty-stepper" aria-label="数量変更">' +
                    '<button type="button" class="qty-stepper__btn js-cart-dec" data-index="' + idx + '" aria-label="数量を減らす">−</button>' +
                    '<span class="qty-stepper__val">' + Number(item.quantity) + '</span>' +
                    '<button type="button" class="qty-stepper__btn js-cart-inc" data-index="' + idx + '" aria-label="数量を増やす">+</button>' +
                  '</div>' +
                  '<button type="button" class="cart-item__remove js-cart-remove" data-index="' + idx + '">REMOVE</button>' +
                '</div>' +
              '</div>' +
            '</div>'
          );
        })
        .join('');

      if (cartFooterEl) cartFooterEl.style.display = 'block';
      if (cartSubtotalEl) cartSubtotalEl.textContent = formatPrice(subtotal);
    }
  }

  /** カートへ商品を追加 */
  function addToCart(productId, color, size, quantity) {
    const product = findProductById(productId);
    if (!product) return;

    const qty = Math.max(1, Number(quantity) || 1);
    const cart = loadCart();
    const existingIndex = cart.findIndex(function (item) {
      return item.productId === productId && item.color === color && item.size === size;
    });

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += qty;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        color: color || product.defaultColor || 'Black',
        size: size || product.defaultSize || 'L',
        quantity: qty
      });
    }

    saveCart(cart);
    hideCheckoutFeedback();
    renderCartUI();
    openCartDrawer();
  }

  function hideCheckoutFeedback() {
    const fb = document.getElementById('cartCheckoutFeedback');
    if (fb) {
      fb.classList.remove('is-visible');
      fb.textContent = '';
    }
  }

  /* ==========================================================================
   * 3. 共通オーバーレイ制御（メニュー・検索・ミニカート・フィルター・モーダル）
   * ========================================================================== */
  const fullscreenMenu = document.getElementById('fullscreenMenu');
  const searchPanel = document.getElementById('searchPanel');
  const cartDrawer = document.getElementById('cartDrawer');
  const filterPanel = document.getElementById('filterPanel');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const legalModal = document.getElementById('legalModal');
  const lightboxModal = document.getElementById('lightboxModal');

  function updateBodyLock() {
    const anyOpen =
      (fullscreenMenu && fullscreenMenu.classList.contains('is-open')) ||
      (cartDrawer && cartDrawer.classList.contains('is-open')) ||
      (legalModal && legalModal.classList.contains('is-open')) ||
      (lightboxModal && lightboxModal.classList.contains('is-open')) ||
      (filterPanel && filterPanel.classList.contains('is-open') && window.innerWidth <= 900);

    document.body.classList.toggle('is-locked', Boolean(anyOpen));
  }

  function openFullscreenMenu() {
    closeSearchPanel();
    closeCartDrawer();
    if (!fullscreenMenu) return;
    fullscreenMenu.classList.add('is-open');
    fullscreenMenu.setAttribute('aria-hidden', 'false');
    const menuBtn = document.getElementById('menuOpenBtn');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    updateBodyLock();
  }

  function closeFullscreenMenu() {
    if (!fullscreenMenu) return;
    fullscreenMenu.classList.remove('is-open');
    fullscreenMenu.setAttribute('aria-hidden', 'true');
    const menuBtn = document.getElementById('menuOpenBtn');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    updateBodyLock();
  }

  function openCartDrawer() {
    closeFullscreenMenu();
    closeSearchPanel();
    closeMobileFilterIfOpen();
    if (!cartDrawer) return;
    cartDrawer.classList.add('is-open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    if (drawerBackdrop) drawerBackdrop.classList.add('is-open');
    updateBodyLock();
  }

  function closeCartDrawer() {
    if (!cartDrawer) return;
    cartDrawer.classList.remove('is-open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    if (drawerBackdrop && !(filterPanel && filterPanel.classList.contains('is-open') && window.innerWidth <= 900)) {
      drawerBackdrop.classList.remove('is-open');
    }
    updateBodyLock();
  }

  function closeMobileFilterIfOpen() {
    if (filterPanel && window.innerWidth <= 900 && filterPanel.classList.contains('is-open')) {
      filterPanel.classList.remove('is-open');
      const toggleBtn = document.getElementById('filterToggleBtn');
      if (toggleBtn) toggleBtn.classList.remove('is-active');
      if (drawerBackdrop && !(cartDrawer && cartDrawer.classList.contains('is-open'))) {
        drawerBackdrop.classList.remove('is-open');
      }
      updateBodyLock();
    }
  }

  function openSearchPanel() {
    closeFullscreenMenu();
    closeCartDrawer();
    if (!searchPanel) return;
    searchPanel.classList.add('is-open');
    searchPanel.setAttribute('aria-hidden', 'false');
    const input = document.getElementById('headerSearchInput');
    renderHeaderSearchResults(input ? input.value : '');
    if (input) {
      setTimeout(function () {
        input.focus();
      }, 60);
    }
  }

  function closeSearchPanel() {
    if (!searchPanel) return;
    searchPanel.classList.remove('is-open');
    searchPanel.setAttribute('aria-hidden', 'true');
  }

  function renderHeaderSearchResults(rawQuery) {
    const container = document.getElementById('searchResultsContainer');
    if (!container) return;

    const q = String(rawQuery || '').trim().toLowerCase();
    let matched = [];

    if (!q) {
      // 未入力時は注目の新着4アイテムを表示
      matched = (DATA.newArrivalIds || [])
        .map(findProductById)
        .filter(Boolean);
    } else {
      matched = PRODUCTS.filter(function (p) {
        return (
          p.name.toLowerCase().indexOf(q) !== -1 ||
          p.subtitleEn.toLowerCase().indexOf(q) !== -1 ||
          p.category.toLowerCase().indexOf(q) !== -1 ||
          p.description.toLowerCase().indexOf(q) !== -1 ||
          p.material.toLowerCase().indexOf(q) !== -1
        );
      });
    }

    if (matched.length === 0) {
      container.innerHTML =
        '<div class="search-results__footer">' +
          '<span>「' + escapeHtml(rawQuery) + '」に一致するアイテムは見つかりませんでした。</span>' +
          '<a href="products.html" class="link-arrow">VIEW ALL PRODUCTS →</a>' +
        '</div>';
      return;
    }

    const previewItems = matched.slice(0, 4);
    const headingLabel = q ? 'SEARCH RESULTS (' + matched.length + ')' : 'RECOMMENDED ITEMS';
    const viewAllHref = q ? 'products.html?q=' + encodeURIComponent(rawQuery.trim()) : 'products.html';

    container.innerHTML =
      '<div class="eyebrow" style="margin-bottom:10px;">' + escapeHtml(headingLabel) + '</div>' +
      '<div class="search-results__grid">' +
        previewItems
          .map(function (p) {
            return (
              '<a href="product.html?id=' + encodeURIComponent(p.id) + '" class="search-result-item">' +
                '<img src="' + escapeHtml(p.images[0]) + '" alt="' + escapeHtml(p.name) + '" class="search-result-item__img">' +
                '<div class="search-result-item__meta">' +
                  '<div class="search-result-item__cat">' + escapeHtml(p.category) + '</div>' +
                  '<div class="search-result-item__name">' + escapeHtml(p.name) + '</div>' +
                  '<div class="search-result-item__price">' + formatPrice(p.price) + '</div>' +
                '</div>' +
              '</a>'
            );
          })
          .join('') +
      '</div>' +
      '<div class="search-results__footer">' +
        '<span>全' + matched.length + '件のアイテム</span>' +
        '<a href="' + escapeHtml(viewAllHref) + '" class="link-arrow">一覧ですべて見る →</a>' +
      '</div>';
  }

  /* ==========================================================================
   * 4. 利用規約・プライバシーポリシー モーダル制御
   * ========================================================================== */
  const LEGAL_CONTENTS = {
    privacy: {
      title: 'プライバシーポリシー / PRIVACY POLICY',
      html:
        '<h3>1. 個人情報の取得と利用目的</h3>' +
        '<p>URBAN CLOSET（以下「当ブランド」）は、お客さまからのお問い合わせ、ニュースレター配信登録、ご注文手続き等に際して取得した氏名・住所・メールアドレス等の個人情報を、商品の発送、お問い合わせへの回答、およびご希望されたお客さまへの最新コレクション案内の目的でのみ適切に利用いたします。</p>' +
        '<h3>2. 個人情報の安全管理</h3>' +
        '<p>当ブランドは、お預かりした個人情報の漏洩・滅失・改ざんを防止するため、SSL暗号化通信および厳格なアクセス管理体制を維持いたします。</p>' +
        '<h3>3. 第三者提供の制限</h3>' +
        '<p>法令に基づく場合、および配送業者・決済代行会社など業務遂行上必要な委託先を除き、お客さまご本人の同意なく個人情報を第三者へ提供することはございません。</p>' +
        '<h3>4. お問い合わせ窓口</h3>' +
        '<p>個人情報の開示・訂正・配信停止・削除をご希望の場合は、CONTACTページのお問い合わせフォームよりご連絡ください。速やかに対応いたします。</p>'
    },
    terms: {
      title: '利用規約 / TERMS OF SERVICE',
      html:
        '<h3>第1条（適用範囲）</h3>' +
        '<p>本規約は、URBAN CLOSET公式オンラインストア（以下「本サイト」）が提供するすべてのサービスおよび商品の閲覧・購入手続きに適用されます。</p>' +
        '<h3>第2条（ご注文・配送・送料）</h3>' +
        '<p>ご注文確認後、通常1〜3営業日以内に発送いたします。1回のご注文合計金額が15,000円（税込）以上の場合は国内送料無料、15,000円未満の場合は全国一律660円（税込）の送料を申し受けます。</p>' +
        '<h3>第3条（返品・サイズ交換ポリシー）</h3>' +
        '<p>室内でのご試着のみ・商品タグが付いたままの未使用品に限り、商品到着後7日以内のサイズ交換を承ります。不良品や誤配送があった場合は、送料当ブランド負担にて速やかに交換または返金対応いたします。</p>' +
        '<h3>第4条（知的財産権）</h3>' +
        '<p>本サイトに掲載されている写真・文章・ロゴ・デザイン等の著作権および商標権はURBAN CLOSETまたは正当な権利者に帰属し、無断転載・複製を禁じます。</p>'
    }
  };

  function openLegalModal(type) {
    const data = LEGAL_CONTENTS[type];
    if (!legalModal || !data) return;
    const titleEl = document.getElementById('legalModalTitle');
    const bodyEl = document.getElementById('legalModalBody');
    if (titleEl) titleEl.textContent = data.title;
    if (bodyEl) bodyEl.innerHTML = data.html;
    legalModal.classList.add('is-open');
    legalModal.setAttribute('aria-hidden', 'false');
    updateBodyLock();
  }

  function closeLegalModal() {
    if (!legalModal) return;
    legalModal.classList.remove('is-open');
    legalModal.setAttribute('aria-hidden', 'true');
    updateBodyLock();
  }

  /* ==========================================================================
   * 5. 共通イベントリスナー登録（ヘッダー・ミニカート・ニュースレター等）
   * ========================================================================== */
  function initGlobalUI() {
    renderCartUI();

    // メニュー開閉
    const menuOpenBtn = document.getElementById('menuOpenBtn');
    const menuCloseBtn = document.getElementById('menuCloseBtn');
    if (menuOpenBtn) menuOpenBtn.addEventListener('click', openFullscreenMenu);
    if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeFullscreenMenu);

    // 検索パネル開閉＆リアルタイム検索
    const searchToggleBtn = document.getElementById('searchToggleBtn');
    const searchCloseBtn = document.getElementById('searchCloseBtn');
    const searchForm = document.getElementById('headerSearchForm');
    const searchInput = document.getElementById('headerSearchInput');

    if (searchToggleBtn) {
      searchToggleBtn.addEventListener('click', function () {
        if (searchPanel && searchPanel.classList.contains('is-open')) {
          closeSearchPanel();
        } else {
          openSearchPanel();
        }
      });
    }
    if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearchPanel);
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        renderHeaderSearchResults(searchInput.value);
      });
    }
    if (searchForm) {
      searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const val = searchInput ? searchInput.value.trim() : '';
        window.location.href = val ? 'products.html?q=' + encodeURIComponent(val) : 'products.html';
      });
    }

    // ミニカート開閉＆内部操作
    const cartOpenBtn = document.getElementById('cartOpenBtn');
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    const cartContinueBtn = document.getElementById('cartContinueBtn');
    const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');
    const cartBodyEl = document.getElementById('cartDrawerBody');

    if (cartOpenBtn) cartOpenBtn.addEventListener('click', openCartDrawer);
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);
    if (cartContinueBtn) cartContinueBtn.addEventListener('click', closeCartDrawer);

    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', function () {
        closeCartDrawer();
        closeMobileFilterIfOpen();
      });
    }

    if (cartBodyEl) {
      cartBodyEl.addEventListener('click', function (e) {
        const incBtn = e.target.closest('.js-cart-inc');
        const decBtn = e.target.closest('.js-cart-dec');
        const remBtn = e.target.closest('.js-cart-remove');
        const cart = loadCart();

        if (incBtn) {
          const idx = Number(incBtn.dataset.index);
          if (cart[idx]) {
            cart[idx].quantity += 1;
            saveCart(cart);
            hideCheckoutFeedback();
            renderCartUI();
          }
        } else if (decBtn) {
          const idx = Number(decBtn.dataset.index);
          if (cart[idx]) {
            if (cart[idx].quantity > 1) {
              cart[idx].quantity -= 1;
            } else {
              cart.splice(idx, 1);
            }
            saveCart(cart);
            hideCheckoutFeedback();
            renderCartUI();
          }
        } else if (remBtn) {
          const idx = Number(remBtn.dataset.index);
          if (cart[idx]) {
            cart.splice(idx, 1);
            saveCart(cart);
            hideCheckoutFeedback();
            renderCartUI();
          }
        }
      });
    }

    if (cartCheckoutBtn) {
      cartCheckoutBtn.addEventListener('click', function () {
        const fb = document.getElementById('cartCheckoutFeedback');
        saveCart([]);
        renderCartUI();
        if (fb) {
          fb.textContent = 'ご注文シミュレーションが完了しました。URBAN CLOSET公式オンラインストアをご覧いただきありがとうございます。';
          fb.classList.add('is-visible');
        }
      });
    }

    // 利用規約・プライバシーポリシーモーダル
    document.querySelectorAll('[data-legal-modal]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openLegalModal(btn.getAttribute('data-legal-modal'));
      });
    });

    const legalCloseBtn = document.getElementById('legalModalCloseBtn');
    if (legalCloseBtn) legalCloseBtn.addEventListener('click', closeLegalModal);
    if (legalModal) {
      legalModal.addEventListener('click', function (e) {
        if (e.target === legalModal) closeLegalModal();
      });
    }

    // ニュースレター登録フォーム（TOPページ＆全ページ共通フッターの両方で動作）
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    document.querySelectorAll('.js-newsletter-form').forEach(function (form) {
      const input = form.querySelector('input[type="email"]');
      const feedback = form.parentElement ? form.parentElement.querySelector('.js-newsletter-feedback') : null;

      if (input) {
        input.addEventListener('input', function () {
          input.classList.remove('is-error');
          if (feedback && feedback.classList.contains('is-error')) {
            feedback.textContent = '';
            feedback.className = feedback.className.replace(/\bis-error\b|\bis-success\b/g, '').trim();
          }
        });
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!input || !feedback) return;
        const val = input.value.trim();

        if (!val) {
          input.classList.add('is-error');
          feedback.textContent = '※メールアドレスをご入力ください。';
          feedback.classList.remove('is-success');
          feedback.classList.add('is-error');
          return;
        }
        if (!emailRegex.test(val)) {
          input.classList.add('is-error');
          feedback.textContent = '※正しいメールアドレス形式（例：name@example.com）でご入力ください。';
          feedback.classList.remove('is-success');
          feedback.classList.add('is-error');
          return;
        }

        input.classList.remove('is-error');
        input.value = '';
        feedback.textContent = 'ご登録ありがとうございます。URBAN CLOSETの最新ニュースをお届けいたします。';
        feedback.classList.remove('is-error');
        feedback.classList.add('is-success');
      });
    });

    // ESCキー一括クローズ対応
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (lightboxModal && lightboxModal.classList.contains('is-open')) {
          closeLightbox();
          return;
        }
        if (legalModal && legalModal.classList.contains('is-open')) {
          closeLegalModal();
          return;
        }
        if (fullscreenMenu && fullscreenMenu.classList.contains('is-open')) {
          closeFullscreenMenu();
          return;
        }
        if (cartDrawer && cartDrawer.classList.contains('is-open')) {
          closeCartDrawer();
          return;
        }
        if (searchPanel && searchPanel.classList.contains('is-open')) {
          closeSearchPanel();
          return;
        }
        closeMobileFilterIfOpen();
      }
    });
  }

  /* ==========================================================================
   * 6. 共通ライトボックス制御（LOOKBOOK拡大 ＆ PRODUCT DETAIL画像拡大）
   * ========================================================================== */
  let lightboxState = {
    mode: 'lookbook', // 'lookbook' | 'product'
    items: [],
    currentIndex: 0
  };

  function openLightbox(mode, items, startIndex) {
    if (!lightboxModal || !items || items.length === 0) return;
    lightboxState.mode = mode;
    lightboxState.items = items;
    lightboxState.currentIndex = Math.max(0, Math.min(items.length - 1, Number(startIndex) || 0));

    lightboxModal.classList.toggle('lightbox--image-only', mode === 'product');
    renderLightboxSlide();
    lightboxModal.classList.add('is-open');
    lightboxModal.setAttribute('aria-hidden', 'false');
    updateBodyLock();
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('is-open');
    lightboxModal.setAttribute('aria-hidden', 'true');
    updateBodyLock();
  }

  function stepLightbox(delta) {
    const len = lightboxState.items.length;
    if (len <= 1) return;
    lightboxState.currentIndex = (lightboxState.currentIndex + delta + len) % len;
    renderLightboxSlide();
  }

  function renderLightboxSlide() {
    const item = lightboxState.items[lightboxState.currentIndex];
    if (!item) return;

    const total = lightboxState.items.length;
    const currentNum = String(lightboxState.currentIndex + 1).padStart(2, '0');
    const totalNum = String(total).padStart(2, '0');

    const counterEl = document.getElementById('lightboxCounter');
    const imgEl = document.getElementById('lightboxImage');
    const sidebarEl = document.getElementById('lightboxSidebar');

    if (counterEl) counterEl.textContent = currentNum + ' / ' + totalNum;
    if (imgEl) {
      imgEl.src = item.image;
      imgEl.alt = item.alt || item.fullTitle || 'URBAN CLOSET VISUAL';
    }

    if (lightboxState.mode === 'lookbook' && sidebarEl) {
      const linksHTML = (item.items || [])
        .map(function (wear) {
          const prod = findProductById(wear.id);
          if (!prod) return '';
          return (
            '<a href="product.html?id=' + encodeURIComponent(prod.id) + '" class="lightbox__item-link">' +
              '<img src="' + escapeHtml(prod.images[0]) + '" alt="' + escapeHtml(prod.name) + '">' +
              '<div class="lightbox__item-meta">' +
                '<div class="lightbox__item-name">' + escapeHtml(prod.name) + '</div>' +
                '<div class="lightbox__item-spec">' + escapeHtml(wear.spec) + '</div>' +
              '</div>' +
              '<div class="lightbox__item-price">' + formatPrice(prod.price) + ' →</div>' +
            '</a>'
          );
        })
        .join('');

      sidebarEl.innerHTML =
        '<h2 class="lightbox__look-title">' + escapeHtml(item.fullTitle) + '</h2>' +
        '<p class="lightbox__look-desc">' + escapeHtml(item.description) + '</p>' +
        '<div class="lightbox__items-heading">ITEMS IN THIS LOOK</div>' +
        '<div>' + linksHTML + '</div>';
    }
  }

  function initLightboxEvents() {
    if (!lightboxModal) return;
    const closeBtn = document.getElementById('lightboxCloseBtn');
    const prevBtn = document.getElementById('lightboxPrevBtn');
    const nextBtn = document.getElementById('lightboxNextBtn');
    const mediaArea = document.getElementById('lightboxMediaArea');

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', function () { stepLightbox(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { stepLightbox(1); });

    if (mediaArea) {
      mediaArea.addEventListener('click', function (e) {
        if (e.target === mediaArea) closeLightbox();
      });

      // スマホ左右スワイプ対応
      let touchStartX = 0;
      mediaArea.addEventListener('touchstart', function (e) {
        if (e.changedTouches && e.changedTouches[0]) {
          touchStartX = e.changedTouches[0].clientX;
        }
      }, { passive: true });

      mediaArea.addEventListener('touchend', function (e) {
        if (e.changedTouches && e.changedTouches[0]) {
          const diff = e.changedTouches[0].clientX - touchStartX;
          if (Math.abs(diff) > 45) {
            stepLightbox(diff < 0 ? 1 : -1);
          }
        }
      }, { passive: true });
    }

    document.addEventListener('keydown', function (e) {
      if (!lightboxModal.classList.contains('is-open')) return;
      if (e.key === 'ArrowLeft') stepLightbox(-1);
      if (e.key === 'ArrowRight') stepLightbox(1);
    });
  }

  /* ==========================================================================
   * 7. PAGE 01：TOPページ専用処理（NEW ARRIVALS 4点描画）
   * ========================================================================== */
  function initTopPage() {
    const newArrivalsGrid = document.getElementById('newArrivalsGrid');
    if (!newArrivalsGrid) return;

    const items = (DATA.newArrivalIds || [])
      .map(findProductById)
      .filter(Boolean);

    newArrivalsGrid.innerHTML = items.map(createProductCardHTML).join('');
  }

  /* ==========================================================================
   * 8. PAGE 02：PRODUCTS（商品一覧・展開式フィルター・ソート・条件タグ）
   * ========================================================================== */
  function initProductsPage() {
    const gridEl = document.getElementById('productsGrid');
    if (!gridEl) return;

    const params = new URLSearchParams(window.location.search);
    const initialCat = (params.get('category') || 'ALL').toUpperCase();
    const validCategories = ['ALL', 'TOPS', 'BOTTOMS', 'OUTERWEAR', 'ACCESSORIES'];

    const state = {
      category: validCategories.indexOf(initialCat) !== -1 ? initialCat : 'ALL',
      color: 'ALL',
      priceRange: 'ALL',
      query: (params.get('q') || '').trim(),
      sort: 'newest'
    };

    const filterToggleBtn = document.getElementById('filterToggleBtn');
    const filterCloseSpBtn = document.getElementById('filterCloseSpBtn');
    const filterApplySpBtn = document.getElementById('filterApplySpBtn');
    const filterResetSpBtn = document.getElementById('filterResetSpBtn');
    const sortSelect = document.getElementById('sortSelect');
    const activeFiltersBar = document.getElementById('activeFiltersBar');

    function applyFilterAndRender() {
      // 1. 絞り込み
      let list = PRODUCTS.filter(function (p) {
        if (state.category !== 'ALL' && p.category !== state.category) return false;
        if (state.color !== 'ALL' && p.colors.indexOf(state.color) === -1) return false;
        if (state.priceRange === 'under-10000' && p.price >= 10000) return false;
        if (state.priceRange === '10000-20000' && (p.price < 10000 || p.price > 20000)) return false;
        if (state.priceRange === 'over-20000' && p.price <= 20000) return false;
        if (state.query) {
          const q = state.query.toLowerCase();
          const hit =
            p.name.toLowerCase().indexOf(q) !== -1 ||
            p.subtitleEn.toLowerCase().indexOf(q) !== -1 ||
            p.category.toLowerCase().indexOf(q) !== -1 ||
            p.description.toLowerCase().indexOf(q) !== -1;
          if (!hit) return false;
        }
        return true;
      });

      // 2. 並び替え
      list = list.slice().sort(function (a, b) {
        if (state.sort === 'price-asc') return a.price - b.price;
        if (state.sort === 'price-desc') return b.price - a.price;
        return (a.arrivalOrder || 99) - (b.arrivalOrder || 99);
      });

      // 3. アクティブUI同期（タブ＆チップ）
      document.querySelectorAll('[data-filter-category]').forEach(function (btn) {
        btn.classList.toggle('is-active', btn.getAttribute('data-filter-category') === state.category);
      });
      document.querySelectorAll('[data-filter-color]').forEach(function (btn) {
        btn.classList.toggle('is-active', btn.getAttribute('data-filter-color') === state.color);
      });
      document.querySelectorAll('[data-filter-price]').forEach(function (btn) {
        btn.classList.toggle('is-active', btn.getAttribute('data-filter-price') === state.priceRange);
      });

      // 4. 件数更新
      document.querySelectorAll('.js-product-count').forEach(function (el) {
        el.textContent = 'SHOWING ' + list.length + ' ITEMS';
      });
      if (filterApplySpBtn) {
        filterApplySpBtn.textContent = '結果を表示する（' + list.length + '件）';
      }

      // 5. 選択中条件タグ描画
      renderActiveTags(list.length);

      // 6. グリッド描画
      if (list.length === 0) {
        gridEl.style.display = 'none';
        const emptyEl = document.getElementById('catalogEmpty');
        if (emptyEl) emptyEl.style.display = 'block';
      } else {
        gridEl.style.display = '';
        const emptyEl = document.getElementById('catalogEmpty');
        if (emptyEl) emptyEl.style.display = 'none';
        gridEl.innerHTML = list.map(createProductCardHTML).join('');
      }
    }

    function renderActiveTags(count) {
      if (!activeFiltersBar) return;
      const tags = [];
      if (state.category !== 'ALL') {
        tags.push({ type: 'category', label: 'CATEGORY: ' + state.category });
      }
      if (state.color !== 'ALL') {
        tags.push({ type: 'color', label: 'COLOR: ' + state.color });
      }
      if (state.priceRange !== 'ALL') {
        const priceLabels = {
          'under-10000': 'PRICE: 〜¥9,999',
          '10000-20000': 'PRICE: ¥10,000〜¥20,000',
          'over-20000': 'PRICE: ¥20,001〜'
        };
        tags.push({ type: 'priceRange', label: priceLabels[state.priceRange] || state.priceRange });
      }
      if (state.query) {
        tags.push({ type: 'query', label: 'KEYWORD: ' + state.query });
      }

      const tagsHTML = tags
        .map(function (t) {
          return (
            '<button type="button" class="active-tag js-remove-tag" data-tag-type="' + escapeHtml(t.type) + '">' +
              '<span>' + escapeHtml(t.label) + '</span>' +
              '<span aria-hidden="true">×</span>' +
            '</button>'
          );
        })
        .join('');

      const clearBtnHTML =
        tags.length > 0
          ? '<button type="button" class="clear-all-btn" id="clearAllFiltersBtn">すべて解除 / CLEAR ALL</button>'
          : '';

      activeFiltersBar.innerHTML =
        '<div class="active-tags">' + tagsHTML + clearBtnHTML + '</div>' +
        '<div class="catalog-count">SHOWING ' + count + ' ITEMS</div>';
    }

    function resetAllFilters() {
      state.category = 'ALL';
      state.color = 'ALL';
      state.priceRange = 'ALL';
      state.query = '';
      applyFilterAndRender();
    }

    // フィルター開閉ボタン
    if (filterToggleBtn && filterPanel) {
      filterToggleBtn.addEventListener('click', function () {
        const willOpen = !filterPanel.classList.contains('is-open');
        filterPanel.classList.toggle('is-open', willOpen);
        filterToggleBtn.classList.toggle('is-active', willOpen);
        filterToggleBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        if (window.innerWidth <= 900 && drawerBackdrop) {
          drawerBackdrop.classList.toggle('is-open', willOpen);
        }
        updateBodyLock();
      });
    }

    if (filterCloseSpBtn) filterCloseSpBtn.addEventListener('click', closeMobileFilterIfOpen);
    if (filterApplySpBtn) filterApplySpBtn.addEventListener('click', closeMobileFilterIfOpen);
    if (filterResetSpBtn) filterResetSpBtn.addEventListener('click', resetAllFilters);

    // カテゴリー・カラー・価格クリック
    document.querySelectorAll('[data-filter-category]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.category = btn.getAttribute('data-filter-category') || 'ALL';
        applyFilterAndRender();
      });
    });

    document.querySelectorAll('[data-filter-color]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.color = btn.getAttribute('data-filter-color') || 'ALL';
        applyFilterAndRender();
      });
    });

    document.querySelectorAll('[data-filter-price]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.priceRange = btn.getAttribute('data-filter-price') || 'ALL';
        applyFilterAndRender();
      });
    });

    // ソート変更
    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        state.sort = sortSelect.value;
        applyFilterAndRender();
      });
    }

    // タグ個別解除＆一括解除
    if (activeFiltersBar) {
      activeFiltersBar.addEventListener('click', function (e) {
        const remTag = e.target.closest('.js-remove-tag');
        if (remTag) {
          const type = remTag.getAttribute('data-tag-type');
          if (type === 'query') state.query = '';
          else if (type) state[type] = 'ALL';
          applyFilterAndRender();
          return;
        }
        if (e.target.closest('#clearAllFiltersBtn')) {
          resetAllFilters();
        }
      });
    }

    const emptyResetBtn = document.getElementById('emptyResetBtn');
    if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAllFilters);

    applyFilterAndRender();
  }

  /* ==========================================================================
   * 9. PAGE 03：PRODUCT DETAIL（サムネイル切替・画像拡大・カート連動）
   * ========================================================================== */
  function initProductDetailPage() {
    const rootEl = document.getElementById('productDetailRoot');
    if (!rootEl) return;

    // ?id=... またはパス末尾スラッグの取得
    const params = new URLSearchParams(window.location.search);
    let requestedId = params.get('id');
    if (!requestedId) {
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      const lastSegment = pathParts[pathParts.length - 1] || '';
      if (lastSegment && lastSegment.indexOf('.html') === -1 && lastSegment !== 'product') {
        requestedId = lastSegment;
      }
    }

    const product = findProductById(requestedId) || PRODUCTS[0];
    if (!product) return;

    // ページタイトルとパンくず更新
    document.title = product.name + ' | URBAN CLOSET（アーバンクローゼット）';
    const bcCategory = document.getElementById('bcCategory');
    const bcProduct = document.getElementById('bcProduct');
    if (bcCategory) {
      bcCategory.textContent = product.category;
      bcCategory.href = 'products.html?category=' + encodeURIComponent(product.category);
    }
    if (bcProduct) {
      bcProduct.textContent = product.name;
    }

    let selectedColor = product.defaultColor || 'Black';
    let selectedSize = product.defaultSize || 'L';
    let selectedQty = 1;
    let currentImgIndex = 0;

    const colorDefs = (DATA.config && DATA.config.colors) || [];

    function getColorDesc(colorId) {
      const found = colorDefs.find(function (c) { return c.id === colorId; });
      return found ? found.description : '';
    }

    // サイズ表HTML生成
    const sizeHeadersHTML = product.sizeGuide.headers
      .map(function (h) { return '<th>' + escapeHtml(h) + '</th>'; })
      .join('');
    const sizeRowsHTML = product.sizeGuide.rows
      .map(function (row) {
        return (
          '<tr>' +
          row.map(function (cell) { return '<td>' + escapeHtml(cell) + '</td>'; }).join('') +
          '</tr>'
        );
      })
      .join('');

    // サブギャラリーHTML（2枚目・3枚目）
    const subGalleryHTML = product.images
      .slice(1)
      .map(function (imgUrl, idx) {
        const realIdx = idx + 1;
        const cap = (product.imageCaptions && product.imageCaptions[realIdx]) || product.name;
        return (
          '<div class="pd-sub-gallery__item js-pd-open-zoom" data-img-index="' + realIdx + '">' +
            '<img src="' + escapeHtml(imgUrl) + '" alt="' + escapeHtml(cap) + '" loading="lazy">' +
            '<div class="pd-sub-gallery__caption">' + escapeHtml(cap) + '</div>' +
          '</div>'
        );
      })
      .join('');

    rootEl.innerHTML =
      '<div class="product-detail-layout">' +
        /* 左カラム：メイン画像＋サムネイル切り替えUI＋サブギャラリー */
        '<div class="pd-gallery">' +
          '<div class="pd-gallery__main-wrap" id="pdMainWrap">' +
            '<img src="' + escapeHtml(product.images[0]) + '" alt="' + escapeHtml(product.name) + '" class="pd-gallery__main-img" id="pdMainImage">' +
            '<button type="button" class="pd-gallery__nav-btn pd-gallery__nav-btn--prev" id="pdPrevImgBtn" aria-label="前の写真">‹</button>' +
            '<button type="button" class="pd-gallery__nav-btn pd-gallery__nav-btn--next" id="pdNextImgBtn" aria-label="次の写真">›</button>' +
            '<button type="button" class="pd-gallery__zoom-btn" id="pdZoomBtn">ZOOM [+]</button>' +
          '</div>' +
          '<div class="pd-thumbs" id="pdThumbs" role="tablist" aria-label="商品画像サムネイル">' +
            product.images
              .map(function (imgUrl, idx) {
                return (
                  '<button type="button" class="pd-thumb-btn' + (idx === 0 ? ' is-active' : '') + '" data-thumb-index="' + idx + '" aria-label="画像 ' + (idx + 1) + ' を表示">' +
                    '<img src="' + escapeHtml(imgUrl) + '" alt="' + escapeHtml(product.name) + ' サムネイル' + (idx + 1) + '">' +
                  '</button>'
                );
              })
              .join('') +
          '</div>' +
          '<div class="pd-sub-gallery">' + subGalleryHTML + '</div>' +
        '</div>' +

        /* 右カラム：スティッキー追従 商品情報パネル */
        '<div class="pd-info">' +
          '<div class="pd-info__brand">' + escapeHtml(product.brand) + '</div>' +
          '<h1 class="pd-info__title ja-heading">' + escapeHtml(product.name) + '</h1>' +
          '<div class="pd-info__subtitle-en">' + escapeHtml(product.subtitleEn) + '</div>' +
          '<div class="pd-info__price-row">' +
            '<span class="pd-info__price">' + formatPrice(product.price) + '</span>' +
            '<span class="pd-info__tax">税込 / TAX INCLUDED</span>' +
          '</div>' +

          /* カラー選択 */
          '<div class="pd-selector">' +
            '<div class="pd-selector__head">' +
              '<span class="pd-selector__label">COLOR — <span id="pdSelectedColorLabel">' + escapeHtml(selectedColor) + '</span></span>' +
            '</div>' +
            '<div class="pd-color-options">' +
              product.colors
                .map(function (c) {
                  const chipClass =
                    c === 'Black' ? 'swatch-dot--black' : c === 'White' ? 'swatch-dot--white' : 'swatch-dot--gray';
                  return (
                    '<button type="button" class="pd-color-btn' + (c === selectedColor ? ' is-active' : '') + '" data-color="' + escapeHtml(c) + '">' +
                      '<span class="pd-color-btn__chip ' + chipClass + '"></span>' +
                      '<span>' + escapeHtml(c) + '</span>' +
                    '</button>'
                  );
                })
                .join('') +
            '</div>' +
            '<p class="pd-color-desc" id="pdColorDesc">' + escapeHtml(getColorDesc(selectedColor)) + '</p>' +
          '</div>' +

          /* サイズ選択 */
          '<div class="pd-selector">' +
            '<div class="pd-selector__head">' +
              '<span class="pd-selector__label">SIZE (UNISEX) — <span id="pdSelectedSizeLabel">' + escapeHtml(selectedSize) + '</span></span>' +
            '</div>' +
            '<div class="pd-size-options">' +
              product.sizes
                .map(function (s) {
                  return (
                    '<button type="button" class="pd-size-btn' + (s === selectedSize ? ' is-active' : '') + '" data-size="' + escapeHtml(s) + '">' +
                      escapeHtml(s) +
                    '</button>'
                  );
                })
                .join('') +
            '</div>' +
            '<p class="pd-size-note">※身長160cm前後の方はS〜M、身長175cm前後の方はLサイズが標準的なリラックスフィットの目安です。</p>' +
          '</div>' +

          /* 数量＆カート追加 */
          '<div class="pd-purchase-row">' +
            '<div class="pd-qty" aria-label="数量選択">' +
              '<button type="button" id="pdQtyDecBtn" aria-label="数量を減らす">−</button>' +
              '<span id="pdQtyValue">1</span>' +
              '<button type="button" id="pdQtyIncBtn" aria-label="数量を増やす">+</button>' +
            '</div>' +
            '<button type="button" class="btn-primary pd-add-btn" id="pdAddToCartBtn">ADD TO CART / カートに追加する</button>' +
          '</div>' +
          '<p class="pd-reassurance">¥15,000以上のご注文で国内送料無料 ｜ 到着後7日以内のサイズ交換対応</p>' +

          /* 商品説明・素材スペック */
          '<div class="pd-description-block">' +
            '<p class="pd-description-block__text">' + escapeHtml(product.description) + '</p>' +
            '<dl class="pd-specs">' +
              '<dt>MATERIAL / 素材・生地</dt>' +
              '<dd>' + escapeHtml(product.material) + '</dd>' +
              '<dt>MODEL FIT / 着用サイズ目安</dt>' +
              '<dd>' + escapeHtml(product.modelFit) + '</dd>' +
            '</dl>' +
          '</div>' +

          /* サイズガイド表 */
          '<div class="pd-size-guide">' +
            '<h2 class="pd-size-guide__title">SIZE GUIDE (cm)</h2>' +
            '<table class="size-table">' +
              '<thead><tr>' + sizeHeadersHTML + '</tr></thead>' +
              '<tbody>' + sizeRowsHTML + '</tbody>' +
            '</table>' +
          '</div>' +

          /* 配送・返品アコーディオン */
          '<div class="accordion">' +
            '<div class="accordion-item">' +
              '<button type="button" class="accordion-trigger js-accordion-trigger" aria-expanded="false">' +
                '<span>配送・送料について</span>' +
                '<span class="accordion-icon" aria-hidden="true"></span>' +
              '</button>' +
              '<div class="accordion-panel">' +
                'ご注文確認後、通常1〜3営業日以内に発送いたします。1回のご注文合計が¥15,000（税込）以上で国内送料無料（¥15,000未満は全国一律¥660）でお届けします。' +
              '</div>' +
            '</div>' +
            '<div class="accordion-item">' +
              '<button type="button" class="accordion-trigger js-accordion-trigger" aria-expanded="false">' +
                '<span>返品・サイズ交換について</span>' +
                '<span class="accordion-icon" aria-hidden="true"></span>' +
              '</button>' +
              '<div class="accordion-panel">' +
                '室内でのご試着のみ・タグ付きの未使用品に限り、商品到着後7日以内のサイズ交換を承っております。ご希望の際は <a href="contact.html" style="text-decoration:underline;">CONTACTページ</a> よりご連絡ください。' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    // 画像切り替え関数
    const mainImgEl = document.getElementById('pdMainImage');
    const thumbBtns = rootEl.querySelectorAll('[data-thumb-index]');

    function setMainImage(idx) {
      const total = product.images.length;
      currentImgIndex = (idx + total) % total;
      if (mainImgEl) {
        mainImgEl.src = product.images[currentImgIndex];
      }
      thumbBtns.forEach(function (btn) {
        btn.classList.toggle('is-active', Number(btn.getAttribute('data-thumb-index')) === currentImgIndex);
      });
    }

    thumbBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setMainImage(Number(btn.getAttribute('data-thumb-index')));
      });
    });

    const prevImgBtn = document.getElementById('pdPrevImgBtn');
    const nextImgBtn = document.getElementById('pdNextImgBtn');
    if (prevImgBtn) prevImgBtn.addEventListener('click', function () { setMainImage(currentImgIndex - 1); });
    if (nextImgBtn) nextImgBtn.addEventListener('click', function () { setMainImage(currentImgIndex + 1); });

    // スマホでのメイン画像スワイプ対応
    const mainWrap = document.getElementById('pdMainWrap');
    if (mainWrap) {
      let startX = 0;
      mainWrap.addEventListener('touchstart', function (e) {
        if (e.changedTouches && e.changedTouches[0]) startX = e.changedTouches[0].clientX;
      }, { passive: true });
      mainWrap.addEventListener('touchend', function (e) {
        if (e.changedTouches && e.changedTouches[0]) {
          const diff = e.changedTouches[0].clientX - startX;
          if (Math.abs(diff) > 45) setMainImage(currentImgIndex + (diff < 0 ? 1 : -1));
        }
      }, { passive: true });
    }

    // クリック拡大ライトボックス起動
    const lightboxProductSlides = product.images.map(function (url, idx) {
      return {
        image: url,
        alt: product.name + ' - ' + ((product.imageCaptions && product.imageCaptions[idx]) || '')
      };
    });

    if (mainImgEl) {
      mainImgEl.addEventListener('click', function () {
        openLightbox('product', lightboxProductSlides, currentImgIndex);
      });
    }
    const zoomBtn = document.getElementById('pdZoomBtn');
    if (zoomBtn) {
      zoomBtn.addEventListener('click', function () {
        openLightbox('product', lightboxProductSlides, currentImgIndex);
      });
    }
    rootEl.querySelectorAll('.js-pd-open-zoom').forEach(function (el) {
      el.addEventListener('click', function () {
        openLightbox('product', lightboxProductSlides, Number(el.getAttribute('data-img-index')) || 0);
      });
    });

    // カラー選択
    const colorBtns = rootEl.querySelectorAll('[data-color]');
    const colorLabelEl = document.getElementById('pdSelectedColorLabel');
    const colorDescEl = document.getElementById('pdColorDesc');
    colorBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectedColor = btn.getAttribute('data-color') || 'Black';
        colorBtns.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
        if (colorLabelEl) colorLabelEl.textContent = selectedColor;
        if (colorDescEl) colorDescEl.textContent = getColorDesc(selectedColor);
      });
    });

    // サイズ選択
    const sizeBtns = rootEl.querySelectorAll('[data-size]');
    const sizeLabelEl = document.getElementById('pdSelectedSizeLabel');
    sizeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectedSize = btn.getAttribute('data-size') || 'L';
        sizeBtns.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
        if (sizeLabelEl) sizeLabelEl.textContent = selectedSize;
      });
    });

    // 数量ステッパー
    const qtyValEl = document.getElementById('pdQtyValue');
    const qtyDecBtn = document.getElementById('pdQtyDecBtn');
    const qtyIncBtn = document.getElementById('pdQtyIncBtn');
    if (qtyDecBtn) {
      qtyDecBtn.addEventListener('click', function () {
        selectedQty = Math.max(1, selectedQty - 1);
        if (qtyValEl) qtyValEl.textContent = String(selectedQty);
      });
    }
    if (qtyIncBtn) {
      qtyIncBtn.addEventListener('click', function () {
        selectedQty = Math.min(20, selectedQty + 1);
        if (qtyValEl) qtyValEl.textContent = String(selectedQty);
      });
    }

    // カート追加ボタン
    const addBtn = document.getElementById('pdAddToCartBtn');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        addToCart(product.id, selectedColor, selectedSize, selectedQty);
        const originalText = addBtn.textContent;
        addBtn.textContent = 'ADDED TO CART ✓';
        setTimeout(function () {
          addBtn.textContent = originalText;
        }, 1400);
      });
    }

    // 関連商品4点描画
    const relatedGrid = document.getElementById('relatedProductsGrid');
    if (relatedGrid) {
      let relatedItems = (product.relatedIds || []).map(findProductById).filter(Boolean);
      if (relatedItems.length < 4) {
        PRODUCTS.forEach(function (p) {
          if (p.id !== product.id && relatedItems.indexOf(p) === -1 && relatedItems.length < 4) {
            relatedItems.push(p);
          }
        });
      }
      relatedGrid.innerHTML = relatedItems.slice(0, 4).map(createProductCardHTML).join('');
    }
  }

  /* ==========================================================================
   * 10. PAGE 04：ABOUT（ブランドムービー PLAY / PAUSE 演出）
   * ========================================================================== */
  function initAboutPage() {
    const heroEl = document.getElementById('aboutMovieHero');
    const toggleBtn = document.getElementById('movieToggleBtn');
    const timecodeEl = document.getElementById('movieTimecode');
    if (!heroEl || !toggleBtn) return;

    let isPaused = false;
    let seconds = 1;

    setInterval(function () {
      if (isPaused) return;
      seconds = (seconds % 16) + 1;
      if (timecodeEl) {
        timecodeEl.textContent = '00:' + String(seconds).padStart(2, '0') + ' / TOKYO ARCHIVE';
      }
    }, 1000);

    toggleBtn.addEventListener('click', function () {
      isPaused = !isPaused;
      heroEl.classList.toggle('is-paused', isPaused);
      toggleBtn.textContent = isPaused ? '▶ PLAY MOTION' : '❚❚ PAUSE MOTION';
      toggleBtn.setAttribute('aria-pressed', isPaused ? 'true' : 'false');
    });
  }

  /* ==========================================================================
   * 11. PAGE 05：LOOKBOOK（全10カット描画 ＆ ライトボックス連動）
   * ========================================================================== */
  function initLookbookPage() {
    const masonryEl = document.getElementById('lookbookMasonry');
    if (!masonryEl) return;

    masonryEl.innerHTML = LOOKBOOK.map(function (look, idx) {
      return (
        '<button type="button" class="lookbook-card reveal" data-look-index="' + idx + '" aria-label="' + escapeHtml(look.fullTitle) + ' を拡大表示">' +
          '<div class="lookbook-card__frame ' + escapeHtml(look.ratioClass) + '">' +
            '<img src="' + escapeHtml(look.image) + '" alt="' + escapeHtml(look.fullTitle) + '" decoding="async">' +
            '<span class="lookbook-card__badge">VIEW LOOK [+]</span>' +
          '</div>' +
          '<div class="lookbook-card__caption">' +
            '<div class="lookbook-card__label">' + escapeHtml(look.label) + '</div>' +
            '<div class="lookbook-card__ja">' + escapeHtml(look.titleJa) + '</div>' +
          '</div>' +
        '</button>'
      );
    }).join('');

    masonryEl.querySelectorAll('[data-look-index]').forEach(function (card) {
      card.addEventListener('click', function () {
        openLightbox('lookbook', LOOKBOOK, Number(card.getAttribute('data-look-index')) || 0);
      });
    });

    // TOPページのLOOKBOOK PREVIEWから ?look=1 等で遷移してきた場合に自動で該当ルックを開く
    const params = new URLSearchParams(window.location.search);
    const lookParam = params.get('look');
    if (lookParam) {
      const targetIdx = LOOKBOOK.findIndex(function (l) {
        return Number(l.number) === Number(lookParam);
      });
      if (targetIdx >= 0) {
        openLightbox('lookbook', LOOKBOOK, targetIdx);
      }
    }
  }

  /* ==========================================================================
   * 12. PAGE 06：CONTACT（フォームリアルタイム検証 ＆ FAQアコーディオン）
   * ========================================================================== */
  function initAccordions() {
    document.addEventListener('click', function (e) {
      const trigger = e.target.closest('.js-accordion-trigger');
      if (!trigger) return;
      const item = trigger.closest('.accordion-item');
      if (!item) return;

      const willOpen = !item.classList.contains('is-open');
      item.classList.toggle('is-open', willOpen);
      trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });

    // URLハッシュ（#faq-shipping, #faq-exchange 等）に対応するFAQを自動で開く
    if (window.location.hash) {
      const targetEl = document.querySelector(window.location.hash);
      if (targetEl && targetEl.classList.contains('accordion-item')) {
        targetEl.classList.add('is-open');
        const btn = targetEl.querySelector('.js-accordion-trigger');
        if (btn) btn.setAttribute('aria-expanded', 'true');
      }
    }
  }

  function initContactPage() {
    const form = document.getElementById('contactForm');
    const completePanel = document.getElementById('contactCompletePanel');
    const resetFormBtn = document.getElementById('contactNewInquiryBtn');
    if (!form) return;

    const typeField = document.getElementById('inquiryType');
    const msgField = document.getElementById('inquiryMessage');
    const nameField = document.getElementById('inquiryName');
    const emailField = document.getElementById('inquiryEmail');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setFieldError(inputEl, errorId, message) {
      const errEl = document.getElementById(errorId);
      if (!inputEl || !errEl) return;
      if (message) {
        inputEl.classList.add('is-error');
        inputEl.setAttribute('aria-invalid', 'true');
        errEl.textContent = message;
        errEl.classList.add('is-visible');
      } else {
        inputEl.classList.remove('is-error');
        inputEl.removeAttribute('aria-invalid');
        errEl.textContent = '';
        errEl.classList.remove('is-visible');
      }
    }

    function validateSingle(field) {
      if (field === typeField) {
        if (!typeField.value) {
          setFieldError(typeField, 'errorInquiryType', '※お問い合わせ種別を選択してください。');
          return false;
        }
        setFieldError(typeField, 'errorInquiryType', '');
        return true;
      }
      if (field === msgField) {
        if (!msgField.value.trim()) {
          setFieldError(msgField, 'errorInquiryMessage', '※お問い合わせ内容をご入力ください。');
          return false;
        }
        setFieldError(msgField, 'errorInquiryMessage', '');
        return true;
      }
      if (field === nameField) {
        if (!nameField.value.trim()) {
          setFieldError(nameField, 'errorInquiryName', '※氏名をご入力ください。');
          return false;
        }
        setFieldError(nameField, 'errorInquiryName', '');
        return true;
      }
      if (field === emailField) {
        const val = emailField.value.trim();
        if (!val) {
          setFieldError(emailField, 'errorInquiryEmail', '※メールアドレスをご入力ください。');
          return false;
        }
        if (!emailRegex.test(val)) {
          setFieldError(emailField, 'errorInquiryEmail', '※正しいメールアドレス形式（例：name@example.com）でご入力ください。');
          return false;
        }
        setFieldError(emailField, 'errorInquiryEmail', '');
        return true;
      }
      return true;
    }

    [typeField, msgField, nameField, emailField].forEach(function (field) {
      if (!field) return;
      const evtName = field.tagName === 'SELECT' ? 'change' : 'input';
      field.addEventListener(evtName, function () {
        if (field.classList.contains('is-error')) {
          validateSingle(field);
        }
      });
      field.addEventListener('blur', function () {
        if (field.value) validateSingle(field);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const v1 = validateSingle(typeField);
      const v2 = validateSingle(msgField);
      const v3 = validateSingle(nameField);
      const v4 = validateSingle(emailField);

      if (!v1 || !v2 || !v3 || !v4) {
        const firstErr = form.querySelector('.is-error');
        if (firstErr) firstErr.focus();
        return;
      }

      form.style.display = 'none';
      if (completePanel) {
        completePanel.classList.add('is-visible');
        completePanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', function () {
        form.reset();
        if (completePanel) completePanel.classList.remove('is-visible');
        form.style.display = 'flex';
      });
    }
  }

  /* ==========================================================================
   * 13. スクロールフェードイン監視（IntersectionObserver）
   * ========================================================================== */
  function initScrollReveal() {
    const targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ==========================================================================
   * 14. 起動エントリーポイント
   * ========================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initGlobalUI();
    initLightboxEvents();
    initTopPage();
    initProductsPage();
    initProductDetailPage();
    initAboutPage();
    initLookbookPage();
    initAccordions();
    initContactPage();
    initScrollReveal();
  });
})();
