const GlobalState = { score: 0, fillingReady: false, batterReady: false, wrapped: false, steamed: false, language: window.currentLanguage || 'vi' }

function t(key, ...args) { const dict = window.I18N[GlobalState.language]; const val = dict['game_phuthe_' + key]; return typeof val === 'function' ? val(...args) : val }
function playClick() { if (GlobalState.sfx) GlobalState.sfx.play('click') }
function loadImage(url) { return new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = url; }) }
async function optimizeImageTransparent(url, targetW, targetH) {
  const img = await loadImage(url);
  const canvas = document.createElement('canvas');
  canvas.width = img.width; canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      if (pixels[i + 3] > 0) { // Alpha channel is not zero
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      }
    }
  }
  if (minX > maxX) { return url; } // Image is fully transparent
  const trimW = maxX - minX + 1; const trimH = maxY - minY + 1;
  const trimmedCanvas = document.createElement('canvas');
  trimmedCanvas.width = trimW; trimmedCanvas.height = trimH;
  const trimmedCtx = trimmedCanvas.getContext('2d');
  trimmedCtx.drawImage(img, minX, minY, trimW, trimH, 0, 0, trimW, trimH);
  const scale = Math.min(targetW / trimW, targetH / trimH);
  const finalW = trimW * scale; const finalH = trimH * scale;
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = finalW; finalCanvas.height = finalH;
  const finalCtx = finalCanvas.getContext('2d');
  finalCtx.drawImage(trimmedCanvas, 0, 0, finalW, finalH);
  return finalCanvas.toDataURL();
}
function fitSprite(sprite, targetW, targetH) { const tex = sprite.texture; const fw = tex.getSourceImage().width; const fh = tex.getSourceImage().height; const s = Math.min(targetW / fw, targetH / fh); sprite.setScale(s) }
function makeButton(scene, x, y, w, h, label, onClick) { const g = scene.add.graphics(); g.fillStyle(0x2a9d8f, 1); g.fillRoundedRect(x - w / 2, y - h / 2, w, h, 12); g.lineStyle(2, 0x114b5f, 1); g.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 12); const text = scene.add.text(x, y, label, { fontSize: 24, color: '#ffffff' }).setOrigin(0.5); const zone = scene.add.zone(x, y, w, h).setInteractive({ useHandCursor: true }); zone.on('pointerdown', () => { g.setScale(0.95); text.setScale(0.95) }); zone.on('pointerup', () => { g.setScale(1); text.setScale(1); onClick && onClick() }); zone.setData('enable', true); zone.setAlpha(1); zone.enable = (v) => { zone.setInteractive(v ? { useHandCursor: true } : false); zone.setAlpha(v ? 1 : 0.5) }; return zone }
function createProgressBar(scene, x, y, w, h) { const bg = scene.add.graphics(); bg.fillStyle(0xdddddd, 1); bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, 8); const fg = scene.add.graphics(); const set = (p) => { fg.clear(); fg.fillStyle(0xe76f51, 1); fg.fillRoundedRect(x - w / 2, y - h / 2, w * Phaser.Math.Clamp(p, 0, 1), h, 8) }; set(0); return { set } }
function keyExists(scene, key) { return scene.textures.exists(key) }

class StartScene extends Phaser.Scene {
  constructor() { super({ key: 'StartScene' }); }
  create() {
    const w = this.cameras.main.width, h = this.cameras.main.height;
    addText(this, w/2, 140, t('title'), { fontSize: '42px', color: '#2a6a3b' }).setOrigin(0.5);
    const startBtn = this.add.rectangle(w/2, 280, 180, 48, 0x2a6a3b).setInteractive();
    startBtn.on('pointerdown', () => { playClick(); this.scene.start('PreloadScene'); });
  }
}

class PreloadScene extends Phaser.Scene {
  constructor() { super('PreloadScene') }
  preload() {
    const loadingText = this.add.text(this.scale.width / 2, this.scale.height / 2, t('loading'), { fontSize: 26, color: '#333' }).setOrigin(0.5)
    const images = [
      ['pan', 'assets/pan.png'],
      ['panatfmix', 'assets/panatfmix.png'],
      ['bowl', 'assets/bowl.png'],
      ['noihap', 'assets/noihap.png'],
      ['hapbanh', 'assets/hapbanh.png'],
      ['dau', 'assets/dau.png'],
      ['duong', 'assets/duong.png'],
      ['dua', 'assets/dua.png'],
      ['leaf_ok', 'assets/leaf_banana.png'],
      ['leaf_no', 'assets/leaf_wrong.png'],
      ['dough', 'assets/dough.png'],
      ['btn_stir', 'assets/btn_stir.png'],
      ['btn_khuay', 'assets/btn_khuay.png'],
      ['btn_wrap', 'assets/btn_wrap.png'],
      ['btn_steam', 'assets/btn_steam.png'],
      ['mixp', 'assets/mixp.png'],
      ['mixg', 'assets/mixg.png'],
      ['mixt', 'assets/mixt.png'],
      ['mixd', 'assets/mixd.png'],
      ['wrapp', 'assets/wrapp.png'],
      ['wrapt', 'assets/wrapt.png'],
      ['wraptr', 'assets/wraptr.png'],
      ['wrapd', 'assets/wrapd.png'],
      ['banhphuthe', 'assets/banhphuthe.png'],
      ['mobanh', 'assets/mobanh.png'],
    ]
    this.load.audio('click', 'assets/click.mp3');
    images.forEach(([k, p]) => {
      this.load.image(k, p);
      // this.load.image(k, optimizeImageTransparent(p, 100, 100)); // Example usage, adjust targetW/H
    })
    this.load.on('complete', () => { GlobalState.sfx = this.sound; this.scene.start('SceneNhan') })
  }
}

class SceneNhan extends Phaser.Scene {
  constructor() { super('SceneNhan') }
  create() {
    const header = this.add.text(20, 20, t('nhanHeader'), { fontSize: 20, color: '#222' })
    const pan = keyExists(this, 'pan') ? this.add.image(600, 300, 'pan') : this.add.rectangle(600, 300, 420, 240, 0xcccccc)
    if (pan.texture) fitSprite(pan, 420, 240)
    const zone = this.add.zone(600, 300, 380, 220).setRectangleDropZone(380, 220)
    const ingredients = [
      { key: 'dau', label: 'Đậu xanh', x: 120, y: 160 },
      { key: 'duong', label: 'Đường', x: 120, y: 280 },
      { key: 'dua', label: 'Dừa nạo', x: 120, y: 400 },
    ]
    const added = new Set()
    const listSprites = ingredients.map(i => {
      const s = keyExists(this, i.key) ? this.add.image(i.x, i.y, i.key) : this.add.rectangle(i.x, i.y, 140, 80, 0xa8dadc)
      if (s.texture) fitSprite(s, 140, 80)
      s.setInteractive({ cursor: 'grab' })
      this.input.setDraggable(s)
      s.setData('key', i.key)
      const label = this.add.text(i.x, i.y + (s.height ? s.height / 2 + 14 : 60), i.label, { fontSize: 16, color: '#333' }).setOrigin(0.5, 0)
      return s
    })
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => { gameObject.x = dragX; gameObject.y = dragY })
    this.input.on('drop', (pointer, gameObject, dropZone) => { if (dropZone === zone) { added.add(gameObject.getData('key')); const ox = Phaser.Math.Between(-zone.width/4, zone.width/4); const oy = Phaser.Math.Between(-zone.height/6, zone.height/6); gameObject.x = zone.x + ox; gameObject.y = zone.y + oy; gameObject.disableInteractive() } })
    const hint = this.add.text(300, 540, '', { fontSize: 18, color: '#555' }).setOrigin(0.5)
    const bar = createProgressBar(this, 600, 520, 380, 20)
    const stirBtn = makeButton(this, 600, 560, 180, 56, t('stir'), () => {
      if (added.size === 3) {
        let p = 0
        this.tweens.add({ targets: {}, duration: 1500, onUpdate: () => { p += 0.02; bar.set(p) }, onComplete: () => {
          GlobalState.fillingReady = true; GlobalState.score += 20
          if (keyExists(this, 'panatfmix') && pan.texture) { pan.setTexture('panatfmix'); fitSprite(pan, 420, 240) }
          nextBtn.enable(true)
        } })
      }
    })
    stirBtn.enable(false)
    const nextBtn = makeButton(this, 820, 560, 160, 48, t('next'), () => { this.scene.start('SceneVo') })
    nextBtn.enable(false)
    this.time.addEvent({ loop: true, delay: 200, callback: () => {
      const missing = ingredients.filter(i => !added.has(i.key)).map(i => i.label)
      if (missing.length) { hint.setText(t('missing', missing)); stirBtn.enable(false) } else { hint.setText(t('readyStir')); stirBtn.enable(true) }
    } })
  }
}

class SceneVo extends Phaser.Scene {
  constructor() { super('SceneVo') }
  create() {
    const header = this.add.text(20, 20, t('voHeader'), { fontSize: 20, color: '#222' })
    const bowl = keyExists(this, 'bowl') ? this.add.image(450, 300, 'bowl') : this.add.rectangle(450, 300, 360, 200, 0xcccccc)
    if (bowl.texture) fitSprite(bowl, 360, 200)
    const bar = createProgressBar(this, 450, 520, 420, 20)
    let progress = 0
    const frames = ['mixp', 'mixg', 'mixt', 'mixd'].filter(k => keyExists(this, k))
    const btn = makeButton(this, 450, 560, 180, 56, t('mix'), () => {
      progress = Math.min(1, progress + 0.1)
      bar.set(progress)
      const idx = Math.min(frames.length - 1, Math.floor(progress * frames.length))
      if (frames.length && bowl.texture) { bowl.setTexture(frames[idx] || frames[frames.length - 1]); fitSprite(bowl, 360, 200) }
      if (progress >= 1) { GlobalState.batterReady = true; GlobalState.score += 20; this.time.delayedCall(500, () => this.scene.start('SceneGoi')) }
    })
  }
}

class SceneGoi extends Phaser.Scene {
  constructor() { super('SceneGoi') }
  create() {
    const header = this.add.text(20, 20, t('goiHeader'), { fontSize: 20, color: '#222' })
    const slot = this.add.rectangle(450, 320, 360, 220, 0xe9c46a).setStrokeStyle(2, 0x8d6e63)
    const zone = this.add.zone(450, 320, 340, 200).setRectangleDropZone(340, 200)
    const leafOk = keyExists(this, 'leaf_ok') ? this.add.image(160, 220, 'leaf_ok') : this.add.rectangle(160, 220, 180, 100, 0x84a98c)
    const leafNo = keyExists(this, 'leaf_no') ? this.add.image(160, 380, 'leaf_no') : this.add.rectangle(160, 380, 180, 100, 0xed6a5a)
    if (leafOk.texture) fitSprite(leafOk, 180, 100)
    if (leafNo.texture) fitSprite(leafNo, 180, 100)
    leafOk.setInteractive({ cursor: 'grab' }); this.input.setDraggable(leafOk)
    leafNo.setInteractive({ cursor: 'grab' }); this.input.setDraggable(leafNo)
    const hint = this.add.text(450, 560, '', { fontSize: 18, color: '#555' }).setOrigin(0.5)
    let correctPlaced = false
    this.input.on('drop', (pointer, gameObject, dropZone) => {
      if (dropZone === zone) {
        if (gameObject === leafOk) { correctPlaced = true; gameObject.x = zone.x; gameObject.y = zone.y; gameObject.disableInteractive(); hint.setText('') }
        else { hint.setText(t('wrongLeaf')) }
      }
    })
    const dough = keyExists(this, 'dough') ? this.add.image(740, 220, 'dough') : this.add.rectangle(740, 220, 120, 120, 0xffd166)
    if (dough.texture) fitSprite(dough, 120, 120)
    dough.setInteractive({ cursor: 'grab' }); this.input.setDraggable(dough)
    let doughPlaced = false
    this.input.on('drag', (pointer, gameObject, dragX, dragY) => { gameObject.x = dragX; gameObject.y = dragY })
    this.input.on('drop', (pointer, gameObject, dropZone) => {
      if (dropZone === zone && gameObject === dough && correctPlaced) { doughPlaced = true; gameObject.x = zone.x; gameObject.y = zone.y; gameObject.disableInteractive() }
    })
    const btn = makeButton(this, 740, 380, 180, 56, t('wrap'), () => {
      if (!correctPlaced || !doughPlaced) return
      const seq = ['wrapp', 'wrapt', 'wraptr', 'wrapd', 'banhphuthe']
      const available = seq.filter(k => keyExists(this, k))
      let i = 0
      const runner = () => {
        if (i < available.length) {
          const k = available[i]
          if (keyExists(this, k)) { if (leafOk.texture) { leafOk.setTexture(k); fitSprite(leafOk, 180, 100) } else { slot.fillColor = 0xbde0fe } }
          i++
          this.time.delayedCall(250, runner)
        } else { GlobalState.wrapped = true; GlobalState.score += 20; this.time.delayedCall(500, () => this.scene.start('SceneHap')) }
      }
      runner()
    })
  }
}

class SceneHap extends Phaser.Scene {
  constructor() { super('SceneHap') }
  create() {
    const header = this.add.text(20, 20, t('hapHeader'), { fontSize: 20, color: '#222' })
    const steamerKey = keyExists(this, 'hapbanh') ? 'hapbanh' : (keyExists(this, 'noihap') ? 'noihap' : null)
    const steamer = steamerKey ? this.add.image(450, 300, steamerKey) : this.add.rectangle(450, 300, 360, 360, 0xcccccc)
    if (steamer.texture) fitSprite(steamer, 360, 360)
    const bar = createProgressBar(this, 450, 520, 420, 20)
    let holding = false
    let held = 0
    const btn = makeButton(this, 450, 560, 180, 56, t('steam'), () => {})
    btn.on('pointerdown', () => { holding = true })
    btn.on('pointerup', () => { holding = false; if (held >= 3000) { GlobalState.steamed = true; GlobalState.score += 40; this.scene.start('SceneEnd') } })
    this.time.addEvent({ loop: true, delay: 50, callback: () => {
      if (holding) { held += 50; bar.set(held / 3000) } else { held = Math.max(0, held - 150); bar.set(held / 3000) }
    } })
  }
}

class SceneEnd extends Phaser.Scene {
  constructor() { super('SceneEnd') }
  create() {
    const cake = keyExists(this, 'mobanh') ? this.add.image(450, 260, 'mobanh') : this.add.rectangle(450, 260, 420, 420, 0x90be6d)
    if (cake.texture) fitSprite(cake, 420, 420)
    const congrats = this.add.text(450, 40, t('endCongrats'), { fontSize: 24, color: '#222' }).setOrigin(0.5, 0)
    const tip = this.add.text(450, 500, t('endTip'), { fontSize: 18, color: '#444', wordWrap: { width: 800 } }).setOrigin(0.5)
    const langBtn = makeButton(this, 140, 560, 120, 44, GlobalState.language.toUpperCase(), () => { GlobalState.language = GlobalState.language === 'vi' ? 'en' : 'vi'; this.scene.restart() })
    const replayBtn = makeButton(this, 760, 560, 180, 56, t('replay'), () => {
      GlobalState.score = 0; GlobalState.fillingReady = false; GlobalState.batterReady = false; GlobalState.wrapped = false; GlobalState.steamed = false; this.scene.start('SceneNhan')
    })
    const scoreText = this.add.text(450, 80, 'Score: ' + GlobalState.score, { fontSize: 20, color: '#333' }).setOrigin(0.5, 0)
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 900,
  height: 600,
  backgroundColor: '#ffffff',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [StartScene, PreloadScene, SceneNhan, SceneVo, SceneGoi, SceneHap, SceneEnd]
}
function addText(scene, x, y, text, style) { return scene.add.text(x, y, text, style); }
new Phaser.Game(config)