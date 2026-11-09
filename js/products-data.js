/**
 * ============================================================================
 * URBAN CLOSET（アーバンクローゼット）商品・ルックブック マスターデータ
 * ファイル名: js/products-data.js
 * ----------------------------------------------------------------------------
 * 【初心者向けガイド】
 * ・このファイルでは、サイト内に表示される「全12商品のデータ」と
 *   「LOOKBOOK（ルックブック）全10カットのデータ」を一箇所でまとめて管理しています。
 * ・商品名、価格、説明文、サイズ表、画像URLを変更したい場合は、
 *   このファイル内の該当箇所を書き換えるだけで、TOP・一覧・詳細・ミニカート・検索に
 *   自動で反映されます。
 * ・将来 Shopify などの本格ECシステムへ移行する際も、そのままJSONデータとして
 *   エクスポートしやすいクリーンなデータ構造に設計しています。
 * ============================================================================
 */

window.URBAN_CLOSET_DATA = {
  /* ★ブランド共通設定（送料無料ラインや送料などをここで変更できます） */
  config: {
    brandName: 'URBAN CLOSET',
    collectionTitle: '2026 SPRING COLLECTION',
    freeShippingThreshold: 15000, // ★15,000円（税込）以上で国内送料無料
    standardShippingFee: 660,     // ★通常送料（全国一律 660円）
    colors: [
      {
        id: 'Black',
        label: 'Black',
        hex: '#0A0A0A',
        description: '深みのあるマットなジェットブラック（黒）'
      },
      {
        id: 'White',
        label: 'White',
        hex: '#FFFFFF',
        description: '清潔感のあるナチュラルなオフ〜ピュアホワイト（白）'
      },
      {
        id: 'Gray',
        label: 'Gray',
        hex: '#6B7280',
        description: 'コンクリートの陰影を思わせるニュートラルなチャコール〜アッシュグレー（灰）'
      }
    ],
    sizes: ['S', 'M', 'L', 'XL']
  },

  /* ★TOPページの「NEW ARRIVALS」に表示する4商品のIDリスト（順番通りに4点表示されます） */
  newArrivalIds: [
    'soutien-collar-coat',
    'linen-shirt',
    'wide-tapered-pants',
    'oversized-tshirt'
  ],

  /* ==========================================================================
   * ★全12商品マスターデータ（商品名・価格・カテゴリー・画像3枚・サイズ表）
   * ========================================================================== */
  products: [
    {
      id: 'oversized-tshirt',
      arrivalOrder: 4,
      brand: 'URBAN CLOSET',
      name: 'オーバーサイズTシャツ',
      subtitleEn: '8.5OZ HEAVYWEIGHT OVERSIZED TEE',
      price: 6500,
      category: 'TOPS',
      shortSpec: '8.5oz コーマ度詰め天竺 / S–XL',
      colors: ['Black', 'White', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL'],
      defaultColor: 'Black',
      defaultSize: 'L',
      images: [
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1768696082603-5b7a9f0a10ab?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=85'
      ],
      imageCaptions: [
        'ハンガー掛けフロントビュー（Black）',
        'モデル着用シルエット（178cm / Size L）',
        '8.5oz コーマ天竺・バインダーネック首元ディテール'
      ],
      description: '1枚で着ても透けにくく、ジャケットのインナーとしても上品に映える8.5オンスのヘビーウェイトTシャツ。毛羽立ちを抑えた上質なコーマ糸を高密度に編み立てることで、タフな厚みがありながらも滑らかでクリーンな表面感に仕上げました。肩のラインを自然に落としたドロップショルダーと、風を通すゆとりのある身幅に対し、着丈をすっきり整えることでだらしなく見えない都会的なボックスシルエットを実現。繰り返しの洗濯でも首元がヨレにくいバインダーネック仕様です。',
      material: 'Cotton 100%（コーマ糸度詰め天竺 / 8.5oz）',
      modelFit: 'Men 178cm / Lサイズ着用（程よいオーバーサイズ）｜Women 163cm / Mサイズ着用（リラックスフィット）',
      sizeGuide: {
        headers: ['サイズ', '着丈', '身幅', '肩幅', '袖丈'],
        rows: [
          ['S', '68', '57', '53', '22'],
          ['M', '71', '60', '56', '23.5'],
          ['L', '74', '63', '59', '25'],
          ['XL', '77', '66', '62', '26.5']
        ]
      },
      relatedIds: ['wide-tapered-pants', 'linen-shirt', 'soutien-collar-coat', 'drawstring-bag']
    },
    {
      id: 'wide-tapered-pants',
      arrivalOrder: 3,
      brand: 'URBAN CLOSET',
      name: 'ワイドテーパードパンツ',
      subtitleEn: 'ARCHITECTURAL WIDE TAPERED PANTS',
      price: 12000,
      category: 'BOTTOMS',
      shortSpec: '高密度コンパクトツイル / S–XL',
      colors: ['Black', 'White', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL'],
      defaultColor: 'Black',
      defaultSize: 'L',
      images: [
        'https://images.unsplash.com/photo-1613728455120-d00493b5e77e?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1771092358890-0db24db44e56?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1789110853628-7453b31f5ef1?auto=format&fit=crop&w=900&q=85'
      ],
      imageCaptions: [
        'スタジオプロダクトカット（Black）',
        'モデル着用フルボディ（ワイドテーパードシルエット）',
        'ウエストタック＆テーパードライン詳細'
      ],
      description: 'URBAN CLOSETのボトムスラインを象徴する、建築的なフォルムのワイドテーパードパンツ。フロントに配した深めのワンタックが腰まわりに美しい立体感を生み、太ももから裾へ向かって緩やかに絞り込むことで、脚のラインを拾わずにシャープな印象へ導きます。ハリと微光沢を備えた高密度コンパクトツイルを採用し、シワになりにくく自宅でのケアも容易。ウエストはベルトループ付きでありながら背面にのみイージーゴムを内蔵し、クリーンな見た目と快適な穿き心地を両立しました。',
      material: 'Cotton 70%, Polyester 30%（高密度コンパクトツイル / 9.8oz）',
      modelFit: 'Men 178cm / Lサイズ着用｜Women 163cm / Sサイズ着用',
      sizeGuide: {
        headers: ['サイズ', '総丈', 'ウエスト', '渡り幅', '股下'],
        rows: [
          ['S', '97', '68–76', '34', '66'],
          ['M', '100', '73–81', '35.5', '68'],
          ['L', '103', '78–86', '37', '70'],
          ['XL', '106', '83–91', '38.5', '72']
        ]
      },
      relatedIds: ['soutien-collar-coat', 'oversized-tshirt', 'cropped-hoodie', 'rib-knit-vest']
    },
    {
      id: 'linen-shirt',
      arrivalOrder: 2,
      brand: 'URBAN CLOSET',
      name: 'リネンシャツ',
      subtitleEn: 'WASHED FRENCH LINEN RELAXED SHIRT',
      price: 9800,
      category: 'TOPS',
      shortSpec: 'フレンチリネン混ポプリン / S–XL',
      colors: ['Black', 'White', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL'],
      defaultColor: 'White',
      defaultSize: 'M',
      images: [
        'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1580849107868-5ae101e13082?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1567443022715-0d7ad3a48a9b?auto=format&fit=crop&w=900&q=85'
      ],
      imageCaptions: [
        'フロントプロダクトビュー（White）',
        '自然光モデル着用シルエット',
        'カフス・前立て・フレンチリネン混ポプリン生地詳細'
      ],
      description: '清涼感あふれるフレンチリネンに長繊維コットンを交織し、洗いざらしの柔らかな風合いに仕上げたリラックスシャツ。リネン100%特有の強いシワやチクチク感を抑え、素肌の上からでも心地よく羽織れる滑らかなタッチが魅力です。小ぶりに設計したレギュラーカラーと、ステッチを極力表に出さないミニマルな前立てが、カジュアルになりすぎない知的な佇まいを演出。春先は1枚着やニットベストのインナーとして、初夏は袖をまくって軽やかな羽織りとして長く活躍します。',
      material: 'Linen 55%, Cotton 45%（フレンチリネン混ワッシャーポプリン / 5.2oz）',
      modelFit: 'Men 178cm / Lサイズ着用｜Women 163cm / Mサイズ着用（抜き襟風のゆとりある着用感）',
      sizeGuide: {
        headers: ['サイズ', '着丈', '身幅', '肩幅', '袖丈'],
        rows: [
          ['S', '73', '59', '51', '56.5'],
          ['M', '76', '62', '53.5', '58.5'],
          ['L', '79', '65', '56', '60.5'],
          ['XL', '82', '68', '58.5', '62.5']
        ]
      },
      relatedIds: ['cargo-pants', 'rib-knit-vest', 'wide-tapered-pants', 'drawstring-bag']
    },
    {
      id: 'coach-jacket',
      arrivalOrder: 5,
      brand: 'URBAN CLOSET',
      name: 'コーチジャケット',
      subtitleEn: 'MATTE TECH NYLON COACH JACKET',
      price: 18000,
      category: 'OUTERWEAR',
      shortSpec: '撥水マットタスランナイロン / S–XL',
      colors: ['Black', 'White', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL'],
      defaultColor: 'Black',
      defaultSize: 'L',
      images: [
        'https://images.unsplash.com/photo-1766103809717-f57039c6d0ce?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1564628175829-afb5078c0779?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1779911915386-9d9462849eb4?auto=format&fit=crop&w=900&q=85'
      ],
      imageCaptions: [
        'スタジオ正面シルエット',
        'ストリート着用コーディネート（178cm / Size L）',
        'マットタスランナイロン別アングルカット'
      ],
      description: 'ストリートウェアの定番であるコーチジャケットを、極限まで装飾を削ぎ落としてモダンに再構築したライトアウター。スポーティなテカリを抑えたマットなタスランナイロンを採用し、急な小雨も弾く微撥水機能を備えています。フロントにはボディと同色に塗装したフラットなブラインドスナップボタンを配し、裾のドローコードを絞ることで丸みのあるバルーンシルエットへの変化も自在。総裏メッシュ仕様で蒸れにくく、季節の変わり目に毎日手に取りたくなる機能美を備えた一着です。',
      material: '表地 Nylon 100% / 裏地 Polyester 100%（撥水マットタスランナイロン / 6.8oz）',
      modelFit: 'Men 178cm / Lサイズ着用｜Women 163cm / Mサイズ着用',
      sizeGuide: {
        headers: ['サイズ', '着丈', '身幅', '肩幅', '袖丈'],
        rows: [
          ['S', '69', '61', '53', '58'],
          ['M', '72', '64', '55.5', '60'],
          ['L', '75', '67', '58', '62'],
          ['XL', '78', '70', '60.5', '64']
        ]
      },
      relatedIds: ['nylon-shorts', 'layered-long-tshirt', 'logo-cap', 'soutien-collar-coat']
    },
    {
      id: 'cropped-hoodie',
      arrivalOrder: 6,
      brand: 'URBAN CLOSET',
      name: 'クロップドフーディ',
      subtitleEn: '13.2OZ HEAVY FLEECE BOXY HOODIE',
      price: 11000,
      category: 'TOPS',
      shortSpec: '13.2oz 度詰めヘビー裏毛 / S–XL',
      colors: ['Black', 'White', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL'],
      defaultColor: 'Black',
      defaultSize: 'M',
      images: [
        'https://images.unsplash.com/photo-1590759483822-b2fee5aa6bd3?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1704430705052-dc2361906305?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1633942326027-5293945a22b4?auto=format&fit=crop&w=900&q=85'
      ],
      imageCaptions: [
        'ボクシー・クロップド正面シルエット',
        '13.2oz 度詰め裏毛モデル着用バランス',
        'スピンドルレス立体フード造形クローズアップ'
      ],
      description: 'フードが立体的に美しく立ち上がる、13.2オンスの肉厚な度詰め裏毛スウェットを使用したプルオーバーフーディ。たっぷりとした身幅と太めのアームホールに対して、着丈をわずかにコンパクトに設定した「ボクシー・クロップド」バランスが特徴です。お腹が見えるような極端な短丈ではなく、ワイドパンツと合わせた際に脚が長く見え、インナーのTシャツを裾から数センチ覗かせるレイヤードが最も美しく決まるユニセックス寸法。首元のスピンドル（紐）を省いたミニマルな設計で、部屋着感を完全に払拭しています。',
      material: 'Cotton 100%（度詰めヘビーウェイト裏毛 / 13.2oz）',
      modelFit: 'Men 178cm / Lサイズ着用（腰骨ジャストのスッキリ丈）｜Women 163cm / Sサイズ着用（程よいショートボクシー丈）',
      sizeGuide: {
        headers: ['サイズ', '着丈', '身幅', '肩幅', '袖丈'],
        rows: [
          ['S', '60', '60', '56', '56'],
          ['M', '63', '63', '58.5', '58'],
          ['L', '66', '66', '61', '60'],
          ['XL', '69', '69', '63.5', '62']
        ]
      },
      relatedIds: ['layered-long-tshirt', 'wide-tapered-pants', 'cargo-pants', 'soutien-collar-coat']
    },
    {
      id: 'cargo-pants',
      arrivalOrder: 7,
      brand: 'URBAN CLOSET',
      name: 'カーゴパンツ',
      subtitleEn: 'MINIMAL WIDE CARGO TROUSERS',
      price: 14500,
      category: 'BOTTOMS',
      shortSpec: '高密度コットンナイロンウェザー / S–XL',
      colors: ['Black', 'White', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL'],
      defaultColor: 'Gray',
      defaultSize: 'L',
      images: [
        'https://images.unsplash.com/photo-1789938581278-4a28ff217f9c?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1567523680125-43c5dae7e2fb?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1718252540558-7b383b52642e?auto=format&fit=crop&w=900&q=85'
      ],
      imageCaptions: [
        'フラットポケット・ストレートシルエット（Gray）',
        'モデル着用ストリートコーディネート（Black）',
        '高密度コットンナイロンウェザー生地・ステッチ詳細'
      ],
      description: 'ミリタリー由来の機能的なディテールを残しながら、都会のクリーンな装いに溶け込むようアップデートしたワイドカーゴパンツ。サイドのカーゴポケットはマチを抑えたフラットな隠しスナップ仕様にすることで、横から見たときの膨らみを抑え、スラックスのように端正なストレートシルエットを実現しました。軽やかでハリのある高密度コットンナイロンウェザー生地を使用し、裾に内蔵したスピンドルを絞ればスニーカーが際立つジョガー風の着こなしも楽しめます。',
      material: 'Cotton 65%, Nylon 35%（高密度コットンナイロンウェザー / 8.2oz）',
      modelFit: 'Men 178cm / Lサイズ着用｜Women 163cm / Mサイズ着用（裾を絞ってボリュームを出した着用）',
      sizeGuide: {
        headers: ['サイズ', '総丈', 'ウエスト', '渡り幅', '股下'],
        rows: [
          ['S', '98', '68–78', '35.5', '66'],
          ['M', '101', '73–83', '37', '68'],
          ['L', '104', '78–88', '38.5', '70'],
          ['XL', '107', '83–93', '40', '72']
        ]
      },
      relatedIds: ['linen-shirt', 'cropped-hoodie', 'wide-tapered-pants', 'logo-cap']
    },
    {
      id: 'drawstring-bag',
      arrivalOrder: 8,
      brand: 'URBAN CLOSET',
      name: 'ドローストリングバッグ',
      subtitleEn: 'MATTE NYLON DRAWSTRING BAG',
      price: 5500,
      category: 'ACCESSORIES',
      shortSpec: '撥水高密度ツイルナイロン×牛革 / S–XL',
      colors: ['Black', 'White', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL'],
      defaultColor: 'Black',
      defaultSize: 'M',
      images: [
        'https://images.unsplash.com/photo-1558368204-cc52a4a4e519?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1591098204373-9116f28a74bf?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1578237493287-8d4d2b03591a?auto=format&fit=crop&w=900&q=85'
      ],
      imageCaptions: [
        'プロダクト単体ビュー（White）',
        'ユニセックスモデル肩掛けバランス（Black）',
        'マットツイルナイロン＆レザータブ詳細'
      ],
      description: '装いの邪魔をしない無駄のない造形と、柔らかなドレープが魅力のドローストリング（巾着型）ショルダーバッグ。上品な鈍い艶を持つ撥水高密度ツイルナイロンに、引き手部分のみマットなカウレザーのタブをあしらい、ミニマルなアクセントを添えました。コードの長さを結び目で調整することで、手持ち・肩掛け・斜め掛けの3WAYで使用可能。スマートフォンと財布で軽快に出かけられるSサイズから、ノートPCや書類も収まるL・XLサイズまで、ライフスタイルに合わせて選べる4サイズ展開です。',
      material: '本体 Nylon 100%（撥水高密度ツイルナイロン / 7.5oz）/ 付属パーツ 牛革',
      modelFit: 'Men 178cm / Lサイズ使用（13インチPC収納可）｜Women 163cm / Mサイズ使用（デイリー標準サイズ）',
      sizeGuide: {
        headers: ['サイズ', '高さ', '横幅', 'マチ', 'ストラップ最長'],
        rows: [
          ['S', '21', '18', '8', '105'],
          ['M', '26', '23', '10', '115'],
          ['L', '32', '28', '12', '122'],
          ['XL', '38', '34', '14', '128']
        ]
      },
      relatedIds: ['logo-cap', 'linen-shirt', 'oversized-tshirt', 'soutien-collar-coat']
    },
    {
      id: 'soutien-collar-coat',
      arrivalOrder: 1,
      brand: 'URBAN CLOSET',
      name: 'ステンカラーコート',
      subtitleEn: 'OVERSIZED GABARDINE SOUTIEN COLLAR COAT',
      price: 28000,
      category: 'OUTERWEAR',
      shortSpec: '撥水高密度ギャバジン / S–XL',
      colors: ['Black', 'White', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL'],
      defaultColor: 'Gray',
      defaultSize: 'L',
      images: [
        'https://images.unsplash.com/photo-1700748911489-0552c576f274?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1782565196748-2d92d7658dd5?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1553315164-49bb0615e0c6?auto=format&fit=crop&w=900&q=85'
      ],
      imageCaptions: [
        'スタジオAラインフロントシルエット',
        'ストリート着用ドレープカット（178cm / Size L）',
        '撥水高密度ギャバジン・比翼＆袖口仕立てクローズアップ'
      ],
      description: '2026年春コレクションの核となる、美しいAラインシルエットのオーバーサイズ・ステンカラーコート。細番手の糸を超高密度に織り上げた撥水コットンポリエステル・ギャバジンを使用し、歩くたびに空気を含んで優雅に揺れるドレープ感と、しなやかなハリを両立しました。フロントはボタンが隠れる比翼（ひよく）仕立てで極限までミニマルに整え、滑りの良いキュプラ裏地により厚手のフーディやジャケットの上からでもストレスなく羽織ることができます。オン・オフを問わず、纏うだけで佇まいを格上げする一着です。',
      material: '表地 Cotton 72%, Polyester 28%（撥水高密度ギャバジン / 10.5oz）/ 裏地 Cupro 100%',
      modelFit: 'Men 178cm / Lサイズ着用（膝下のロングシルエット）｜Women 163cm / Sサイズ着用',
      sizeGuide: {
        headers: ['サイズ', '着丈', '身幅', '肩幅', '袖丈'],
        rows: [
          ['S', '106', '62', '52', '55'],
          ['M', '110', '65', '54.5', '57'],
          ['L', '114', '68', '57', '59'],
          ['XL', '118', '71', '59.5', '61']
        ]
      },
      relatedIds: ['wide-tapered-pants', 'oversized-tshirt', 'cropped-hoodie', 'coach-jacket']
    },
    {
      id: 'rib-knit-vest',
      arrivalOrder: 9,
      brand: 'URBAN CLOSET',
      name: 'リブニットベスト',
      subtitleEn: 'HIGH-TWIST COTTON RIB KNIT VEST',
      price: 8800,
      category: 'TOPS',
      shortSpec: '7ゲージ強撚片畦ニット / S–XL',
      colors: ['Black', 'White', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL'],
      defaultColor: 'White',
      defaultSize: 'M',
      images: [
        'https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1764844463456-146fa9a6dadf?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1740442535162-fc915d5403f2?auto=format&fit=crop&w=900&q=85'
      ],
      imageCaptions: [
        '7ゲージ片畦リブ編みフロント（White）',
        'モノクローム着用ポートレート',
        '強撚コットンブレンド編地マクロディテール'
      ],
      description: 'シンプルなシャツやTシャツに重ねるだけで、奥行きのある都会的なレイヤードスタイルが完成するクルーネックのリブニットベスト。糸に強い撚（よ）りをかけた強撚コットンにポリエステルをブレンドし、立体的な7ゲージの片畦（かたあぜ）編みで仕立てました。ウールを含まないドライでさらりとした肌触りのため、春から初夏、秋口までロングシーズン着用でき、毛玉ができにくく型崩れしにくいのも特長です。オーバーサイズのインナーとも干渉しない広めのアームホール（袖ぐり）に設計しています。',
      material: 'Cotton 80%, Polyester 20%（7ゲージ強撚片畦ニット / 9.0oz相当）',
      modelFit: 'Men 178cm / Lサイズ着用｜Women 163cm / Mサイズ着用',
      sizeGuide: {
        headers: ['サイズ', '着丈', '身幅', '肩幅', '袖ぐり幅'],
        rows: [
          ['S', '63', '56', '46', '26'],
          ['M', '66', '59', '48.5', '27.5'],
          ['L', '69', '62', '51', '29'],
          ['XL', '72', '65', '53.5', '30.5']
        ]
      },
      relatedIds: ['linen-shirt', 'layered-long-tshirt', 'wide-tapered-pants', 'cargo-pants']
    },
    {
      id: 'nylon-shorts',
      arrivalOrder: 10,
      brand: 'URBAN CLOSET',
      name: 'ナイロンショーツ',
      subtitleEn: 'WATER-REPELLENT WIDE NYLON SHORTS',
      price: 7200,
      category: 'BOTTOMS',
      shortSpec: '撥水塩縮ワッシャーナイロン / S–XL',
      colors: ['Black', 'White', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL'],
      defaultColor: 'Gray',
      defaultSize: 'L',
      images: [
        'https://images.unsplash.com/photo-1789110519828-64a885d10306?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1789110853603-11504d948dde?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1602174940535-c9849f914093?auto=format&fit=crop&w=900&q=85'
      ],
      imageCaptions: [
        'スタジオ着用フロント（Gray）',
        'ライトトーン着用シルエット（White）',
        'コンクリート建築ストリート全身バランス（Black）'
      ],
      description: '大人が街で品よく穿けるバランスを追求した、ワイドシルエットの撥水ナイロンショーツ。塩縮ワッシャー加工を施したナイロン生地は、まるで天然のコットンのようなマットでドライな凹凸感を持ち、アウトドアウェアのような過度なスポーティさを抑えています。裾幅に適度なゆとりを持たせつつ、膝に軽くかかる絶妙な丈感に設定することで、長袖のリネンシャツやコーチジャケットと合わせた「春夏の都会的ショーツスタイル」が自然に決まります。内側には肌離れの良い総メッシュライナー付き。',
      material: '表地 Nylon 100%（撥水塩縮ワッシャーナイロン / 5.0oz）/ 裏地 Polyester 100%',
      modelFit: 'Men 178cm / Lサイズ着用｜Women 163cm / Sサイズ着用',
      sizeGuide: {
        headers: ['サイズ', '総丈', 'ウエスト', '渡り幅', '股下'],
        rows: [
          ['S', '47', '68–78', '34', '18'],
          ['M', '49.5', '73–83', '35.5', '19.5'],
          ['L', '52', '78–88', '37', '21'],
          ['XL', '54.5', '83–93', '38.5', '22.5']
        ]
      },
      relatedIds: ['coach-jacket', 'oversized-tshirt', 'logo-cap', 'layered-long-tshirt']
    },
    {
      id: 'logo-cap',
      arrivalOrder: 11,
      brand: 'URBAN CLOSET',
      name: 'ロゴキャップ',
      subtitleEn: 'MINIMAL EMBROIDERY 6-PANEL CAP',
      price: 4800,
      category: 'ACCESSORIES',
      shortSpec: '8.8oz バイオウォッシュチノ / S–XL',
      colors: ['Black', 'White', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL'],
      defaultColor: 'Black',
      defaultSize: 'L',
      images: [
        'https://images.unsplash.com/photo-1519079754742-f83afaef6d35?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1554201277-9e2c0d5bcd39?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1775326525952-dadb0b3575e8?auto=format&fit=crop&w=900&q=85'
      ],
      imageCaptions: [
        '6パネルフロント＆ミニマル刺繍（Black）',
        'ストリート着用シルエット（Gray / White）',
        'モノトーンカラーバリエーション物撮り'
      ],
      description: '主張しすぎない繊細なタイポグラフィ刺繍をフロントサイドに小さく配した、ミニマルな6パネルベースボールキャップ。程よいハリと洗い加工によるこなれ感を併せ持つ8.8オンスの高密度コットンチノクロスを使用し、季節を問わず着用いただけます。日本人の頭の形に美しくフィットするようクラウン（深さ）をやや深めに設計し、緩やかにカーブしたバイザーが顔まわりをシャープに演出。背面のアジャスターに加え、ベース頭囲の異なるS〜XLの4サイズ展開により、性別を問わず理想のフィット感をお選びいただけます。',
      material: 'Cotton 100%（高密度バイオウォッシュ・チノクロス / 8.8oz）',
      modelFit: 'Men 178cm / Lサイズ着用｜Women 163cm / Sサイズ着用',
      sizeGuide: {
        headers: ['サイズ', '頭周り', '深さ', 'つば長さ', '調整幅'],
        rows: [
          ['S', '55', '11.5', '7.0', '±2.0'],
          ['M', '57', '12.0', '7.2', '±2.0'],
          ['L', '59', '12.5', '7.4', '±2.0'],
          ['XL', '61', '13.0', '7.6', '±2.0']
        ]
      },
      relatedIds: ['drawstring-bag', 'coach-jacket', 'nylon-shorts', 'oversized-tshirt']
    },
    {
      id: 'layered-long-tshirt',
      arrivalOrder: 12,
      brand: 'URBAN CLOSET',
      name: 'レイヤードロンT',
      subtitleEn: 'ARCHITECTURAL HEM LAYERED L/S TEE',
      price: 7800,
      category: 'TOPS',
      shortSpec: '7.4oz オープンエンド双糸天竺 / S–XL',
      colors: ['Black', 'White', 'Gray'],
      sizes: ['S', 'M', 'L', 'XL'],
      defaultColor: 'White',
      defaultSize: 'L',
      images: [
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1537925414548-fa0225a9320d?auto=format&fit=crop&w=900&q=85',
        'https://images.unsplash.com/photo-1598795737563-07467e744bac?auto=format&fit=crop&w=900&q=85'
      ],
      imageCaptions: [
        'フラットレイ物撮り（White）',
        'インダストリアル空間モデル着用（Black）',
        'Black / White / Gray 3色ネックリブ生地クローズアップ'
      ],
      description: '1枚での着用はもちろん、フーディやニットベストのインナーとしても計算されたバランスを生むロングスリーブTシャツ。空気の力で撚り合わせたオープンエンド双糸による7.4オンス天竺は、ふっくらとしたドライな質感と優れた耐久性を備えています。裾部分にさりげない切り替えの段差を持たせたフェイクレイヤード仕様になっており、重ね着をした際のもたつきを解消しながら、腰まわりにシャープなアクセントをプラス。袖口には程よく締まるリブを配し、たくし上げた際にも自然なブラウジング（溜まり）が生まれます。',
      material: 'Cotton 100%（オープンエンド双糸天竺 / 7.4oz）',
      modelFit: 'Men 178cm / Lサイズ着用｜Women 163cm / Mサイズ着用',
      sizeGuide: {
        headers: ['サイズ', '着丈', '身幅', '肩幅', '袖丈'],
        rows: [
          ['S', '70', '56', '51', '58'],
          ['M', '73', '59', '53.5', '60'],
          ['L', '76', '62', '56', '62'],
          ['XL', '79', '65', '58.5', '64']
        ]
      },
      relatedIds: ['cropped-hoodie', 'rib-knit-vest', 'coach-jacket', 'wide-tapered-pants']
    }
  ],

  /* ==========================================================================
   * ★LOOKBOOK 全10カットデータ（2026 SPRING COLLECTION）
   * ========================================================================== */
  lookbook: [
    {
      number: '01',
      label: 'LOOK 01 — MORNING CONCRETE',
      titleJa: '静寂を纏うAライン',
      fullTitle: 'LOOK 01 — MORNING CONCRETE / 静寂を纏うAライン',
      ratio: '3/4',
      ratioClass: 'ratio-3-4',
      image: 'https://images.unsplash.com/photo-1787045098569-2e17ae871df4?auto=format&fit=crop&w=1000&q=85',
      description: '風を含んで大きく揺れるグレーのステンカラーコートを主役に、白のヘビーウェイトTシャツと黒のワイドテーパードパンツで引き締めた王道の3色モノトーンスタイル。',
      items: [
        { id: 'soutien-collar-coat', spec: 'Gray / L' },
        { id: 'oversized-tshirt', spec: 'White / L' },
        { id: 'wide-tapered-pants', spec: 'Black / L' }
      ]
    },
    {
      number: '02',
      label: 'LOOK 02 — AIR & LINEN',
      titleJa: '光を透かすホワイトトーン',
      fullTitle: 'LOOK 02 — AIR & LINEN / 光を透かすホワイトトーン',
      ratio: '4/5',
      ratioClass: 'ratio-4-5',
      image: 'https://images.unsplash.com/photo-1759229874709-a8d0de083b91?auto=format&fit=crop&w=1000&q=85',
      description: '洗いざらしの白のリネンシャツに、同色のミニマルなカーゴパンツを合わせたクリーンなワントーン装い。黒のドローストリングバッグが全体の輪郭をシャープに引き締めます。',
      items: [
        { id: 'linen-shirt', spec: 'White / M' },
        { id: 'cargo-pants', spec: 'White / M' },
        { id: 'drawstring-bag', spec: 'Black / M' }
      ]
    },
    {
      number: '03',
      label: 'LOOK 03 — URBAN UTILITY',
      titleJa: '機能美のモノクローム',
      fullTitle: 'LOOK 03 — URBAN UTILITY / 機能美のモノクローム',
      ratio: '3/4',
      ratioClass: 'ratio-3-4',
      image: 'https://images.unsplash.com/photo-1559038295-f32f4d5bb27c?auto=format&fit=crop&w=1000&q=85',
      description: 'マットな黒のコーチジャケットと撥水ナイロンショーツのセットアップ風コーディネート。裾から覗く白のレイヤードロンTが、重くなりがちな黒に軽快な抜け感を与えます。',
      items: [
        { id: 'coach-jacket', spec: 'Black / L' },
        { id: 'layered-long-tshirt', spec: 'White / L' },
        { id: 'nylon-shorts', spec: 'Black / L' },
        { id: 'logo-cap', spec: 'Black / L' }
      ]
    },
    {
      number: '04',
      label: 'LOOK 04 — PROPORTION PLAY',
      titleJa: '短丈とワイドの黄金比',
      fullTitle: 'LOOK 04 — PROPORTION PLAY / 短丈とワイドの黄金比',
      ratio: '4/3',
      ratioClass: 'ratio-4-3',
      image: 'https://images.unsplash.com/photo-1606628697412-0cc4a23031c4?auto=format&fit=crop&w=1100&q=85',
      description: '13.2オンスの肉厚なクロップドフーディに、ハイウエスト気味のワイドテーパードパンツを合わせた現代的なプロポーション。小柄な方でも重心が上がって美しく見えるバランスです。',
      items: [
        { id: 'cropped-hoodie', spec: 'Gray / S' },
        { id: 'layered-long-tshirt', spec: 'White / S' },
        { id: 'wide-tapered-pants', spec: 'Black / S' }
      ]
    },
    {
      number: '05',
      label: 'LOOK 05 — QUIET LAYERING',
      titleJa: '異素材が織りなす陰影',
      fullTitle: 'LOOK 05 — QUIET LAYERING / 異素材が織りなす陰影',
      ratio: '3/4',
      ratioClass: 'ratio-3-4',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=85',
      description: 'ドライな編地のリブニットベストと、柔らかなグレーのリネンシャツを重ねた知的なレイヤード。同系色でも素材の凹凸を変えることで、立体的で豊かな表情が生まれます。',
      items: [
        { id: 'rib-knit-vest', spec: 'Black / M' },
        { id: 'linen-shirt', spec: 'Gray / M' },
        { id: 'cargo-pants', spec: 'Black / M' }
      ]
    },
    {
      number: '06',
      label: 'LOOK 06 — MINIMAL FORM',
      titleJa: '一枚で成立する輪郭',
      fullTitle: 'LOOK 06 — MINIMAL FORM / 一枚で成立する輪郭',
      ratio: '4/5',
      ratioClass: 'ratio-4-5',
      image: 'https://images.unsplash.com/photo-1776997155893-2fdccbc50d0d?auto=format&fit=crop&w=1000&q=85',
      description: '装飾を削ぎ落としたオーバーサイズTシャツとワイドテーパードパンツのミニマルな組み合わせ。生地そのものの厚みと落ち感があるからこそ、シンプルなワンツーコーデが凛として映えます。',
      items: [
        { id: 'oversized-tshirt', spec: 'Black / L' },
        { id: 'wide-tapered-pants', spec: 'Gray / L' },
        { id: 'drawstring-bag', spec: 'Gray / L' }
      ]
    },
    {
      number: '07',
      label: 'LOOK 07 — SPRING BREEZE',
      titleJa: '軽やかな都会の週末',
      fullTitle: 'LOOK 07 — SPRING BREEZE / 軽やかな都会の週末',
      ratio: '3/4',
      ratioClass: 'ratio-3-4',
      image: 'https://images.unsplash.com/photo-1598211664451-1458e4a3e279?auto=format&fit=crop&w=1000&q=85',
      description: 'ニュアンスのあるグレーのコーチジャケットとナイロンショーツに、白のTシャツとキャップを添えた休日スタイル。ギャラリー巡りやカフェにも自然に馴染む大人のストリート装いです。',
      items: [
        { id: 'coach-jacket', spec: 'Gray / M' },
        { id: 'oversized-tshirt', spec: 'White / M' },
        { id: 'nylon-shorts', spec: 'Gray / S' },
        { id: 'logo-cap', spec: 'White / S' }
      ]
    },
    {
      number: '08',
      label: 'LOOK 08 — SHARED WARDROBE',
      titleJa: '境界のないシルエット',
      fullTitle: 'LOOK 08 — SHARED WARDROBE / 境界のないシルエット',
      ratio: '4/3',
      ratioClass: 'ratio-4-3',
      image: 'https://images.unsplash.com/photo-1614254484392-a97173b3d694?auto=format&fit=crop&w=1200&q=85',
      description: '性別や体格の異なるふたりが、同じコレクションのアイテムをサイズ違いで纏うシェアード・スタイル。ユニセックス専用パターンならではの、それぞれの身体に寄り添う美しい落ち感を表現しています。',
      items: [
        { id: 'soutien-collar-coat', spec: 'Black / L' },
        { id: 'cropped-hoodie', spec: 'Black / M' },
        { id: 'cargo-pants', spec: 'Gray / L' },
        { id: 'drawstring-bag', spec: 'Black / S' }
      ]
    },
    {
      number: '09',
      label: 'LOOK 09 — ARCHITECTURAL KNIT',
      titleJa: '直線と余白のレイヤード',
      fullTitle: 'LOOK 09 — ARCHITECTURAL KNIT / 直線と余白のレイヤード',
      ratio: '3/4',
      ratioClass: 'ratio-3-4',
      image: 'https://images.unsplash.com/photo-1761646062304-096a18cc4233?auto=format&fit=crop&w=1000&q=85',
      description: 'クリーンな白のリブニットベストのインに、黒のレイヤードロンTを合わせたハイコントラストな装い。広めのアームホールが作る直線的なラインがモダンな印象を際立たせます。',
      items: [
        { id: 'rib-knit-vest', spec: 'White / L' },
        { id: 'layered-long-tshirt', spec: 'Black / L' },
        { id: 'wide-tapered-pants', spec: 'Black / L' }
      ]
    },
    {
      number: '10',
      label: 'LOOK 10 — DUSK IN THE CITY',
      titleJa: '夕暮れのストリート・ミニマリズム',
      fullTitle: 'LOOK 10 — DUSK IN THE CITY / 夕暮れのストリート・ミニマリズム',
      ratio: '4/5',
      ratioClass: 'ratio-4-5',
      image: 'https://images.unsplash.com/photo-1792667467319-976e9adad552?auto=format&fit=crop&w=1000&q=85',
      description: '黒のリネンシャツのボタンを開け、グレーのTシャツの上に羽織りとして重ねた夕暮れのスタイル。裾を絞ったカーゴパンツとキャップを合わせ、気負わない都会の空気感をまとめました。',
      items: [
        { id: 'linen-shirt', spec: 'Black / L' },
        { id: 'oversized-tshirt', spec: 'Gray / L' },
        { id: 'cargo-pants', spec: 'Black / L' },
        { id: 'logo-cap', spec: 'Gray / M' }
      ]
    }
  ]
};
