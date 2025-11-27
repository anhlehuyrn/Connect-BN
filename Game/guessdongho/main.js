// Ensure GlobalState and I18N are available
if (typeof window.GlobalState === 'undefined') {
    window.GlobalState = { language: 'vi' }; // Default if not set by main site
}
if (typeof window.I18N === 'undefined') {
    window.I18N = {
        vi: {
            game_dongho_quick_title: 'Đoán Tranh Đông Hồ (Chế độ Nhanh)',
            game_dongho_quick_start: 'Bắt đầu',
            game_dongho_quick_correct: 'Chính xác!',
            game_dongho_quick_wrong: 'Sai rồi!',
            game_dongho_quick_next: 'Tiếp theo',
            game_dongho_quick_score: 'Điểm của bạn: ',
            game_dongho_quick_replay: 'Chơi lại',
            game_dongho_quick_paintings: [
                { name: 'Gà Mái', image: 'conga.png' },
                { name: 'Đàn Lợn Âm Dương', image: 'Pig.png' },
                { name: 'Đám Cưới Chuột', image: 'Rat.png' },
                { name: 'Mục Đồng Thổi Sáo', image: 'Flute.png' },
                { name: 'Hứng Dừa', image: 'Coco.png' },
                { name: 'Đấu Vật', image: 'Wrestle.png' },
                { name: 'Em Bé Ôm Gà', image: 'Rooster.png' },
                { name: 'Em Bé Ôm Vịt', image: 'Duck.png' },
                { name: 'Vinh Quy Bái Tổ', image: 'Return.png' },
                { name: 'Chăn Trâu Thổi Sáo', image: 'Buffalo.png' }
            ],
            game_dongho_deep_title: 'Tìm hiểu Tranh Đông Hồ (Chế độ Chuyên Sâu)',
            game_dongho_deep_start: 'Bắt đầu',
            game_dongho_deep_next: 'Tiếp theo',
            game_dongho_deep_paintings: [
                { name: 'Đám Cưới Chuột', image: 'Rat.png', meaning: 'Tranh châm biếm nạn tham nhũng, đồng thời thể hiện ước vọng về cuộc sống ấm no, hạnh phúc.', symbol: 'Hôn nhân, gia đình, sự sung túc.' },
                { name: 'Mục Đồng Thổi Sáo', image: 'Flute.png', meaning: 'Thể hiện sự thanh bình của làng quê Việt Nam, tình yêu thiên nhiên và cuộc sống giản dị của người nông dân.', symbol: 'Bình yên, hòa hợp, tuổi thơ.' },
                { name: 'Hứng Dừa', image: 'Coco.png', meaning: 'Tranh mang ý nghĩa phồn thực, ca ngợi sự sinh sôi nảy nở và cuộc sống lứa đôi hạnh phúc.', symbol: 'Sinh sôi, tình yêu, hạnh phúc.' },
                { name: 'Đấu Vật', image: 'Wrestle.png', meaning: 'Thể hiện tinh thần thượng võ, sự đoàn kết và sức mạnh của cộng đồng trong các lễ hội truyền thống.', symbol: 'Sức mạnh, đoàn kết, lễ hội.' },
                { name: 'Em Bé Ôm Gà', image: 'Rooster.png', meaning: 'Biểu tượng cho sự sung túc, no đủ, hạnh phúc và mong ước con cái đề huề.', symbol: 'Hạnh phúc, sung túc, con cái.' },
                { name: 'Em Bé Ôm Vịt', image: 'Duck.png', meaning: 'Tương tự như tranh Em Bé Ôm Gà, thể hiện sự no đủ, bình an và sự phát triển của gia đình.', symbol: 'Bình an, phát triển, gia đình.' },
                { name: 'Vinh Quy Bái Tổ', image: 'Return.png', meaning: 'Ca ngợi truyền thống hiếu học, sự thành đạt và lòng biết ơn đối với tổ tiên, quê hương.', symbol: 'Thành đạt, hiếu thảo, truyền thống.' },
                { name: 'Chăn Trâu Thổi Sáo', image: 'Buffalo.png', meaning: 'Thể hiện cuộc sống bình dị, an nhiên của người nông dân, sự hòa hợp giữa con người và thiên nhiên.', symbol: 'Bình dị, hòa hợp, thiên nhiên.' },
                { name: 'Gà Mái', image: 'conga.png', meaning: 'Biểu tượng của sự sung túc, đông con nhiều cháu, gia đình hạnh phúc.', symbol: 'Sung túc, gia đình, con cái.' },
                { name: 'Đàn Lợn Âm Dương', image: 'Pig.png', meaning: 'Biểu tượng của sự no đủ, sung túc, phát triển và sự hài hòa âm dương trong cuộc sống.', symbol: 'No đủ, phát triển, hài hòa.' }
            ]
        },
        en: {
            game_dongho_quick_title: 'Guess Dong Ho Painting (Quick Mode)',
            game_dongho_quick_start: 'Start',
            game_dongho_quick_correct: 'Correct!',
            game_dongho_quick_wrong: 'Wrong!',
            game_dongho_quick_next: 'Next',
            game_dongho_quick_score: 'Your Score: ',
            game_dongho_quick_replay: 'Replay',
            game_dongho_quick_paintings: [
                { name: 'Mother Hen', image: 'conga.png' },
                { name: 'Pigs', image: 'Pig.png' },
                { name: 'Wedding of the Mice', image: 'Rat.png' },
                { name: 'Buffalo Boy Playing Flute', image: 'Flute.png' },
                { name: 'Coconut Picking', image: 'Coco.png' },
                { name: 'Wrestling', image: 'Wrestle.png' },
                { name: 'Boy Hugging Rooster', image: 'Rooster.png' },
                { name: 'Boy Hugging Duck', image: 'Duck.png' },
                { name: 'Returning Home in Glory', image: 'Return.png' },
                { name: 'Buffalo Boy Playing Flute', image: 'Buffalo.png' }
            ],
            game_dongho_deep_title: 'Learn about Dong Ho Painting (Deep Mode)',
            game_dongho_deep_start: 'Start',
            game_dongho_deep_next: 'Next',
            game_dongho_deep_paintings: [
                { name: 'Wedding of the Mice', image: 'Rat.png', meaning: 'The painting satirizes corruption and expresses the wish for a prosperous and happy life.', symbol: 'Marriage, family, prosperity.' },
                { name: 'Buffalo Boy Playing Flute', image: 'Flute.png', meaning: 'Depicts the peacefulness of Vietnamese rural life, love for nature, and the simple life of farmers.', symbol: 'Peace, harmony, childhood.' },
                { name: 'Coconut Picking', image: 'Coco.png', meaning: 'The painting carries a fertility meaning, praising reproduction and a happy married life.', symbol: 'Reproduction, love, happiness.' },
                { name: 'Wrestling', image: 'Wrestle.png', meaning: 'Shows the martial spirit, solidarity, and strength of the community in traditional festivals.', symbol: 'Strength, solidarity, festivals.' },
                { name: 'Boy Hugging Rooster', image: 'Rooster.png', meaning: 'Symbolizes prosperity, abundance, happiness, and the wish for many children.', symbol: 'Happiness, prosperity, children.' },
                { name: 'Boy Hugging Duck', image: 'Duck.png', meaning: 'Similar to the Boy Hugging Rooster painting, it represents abundance, peace, and family development.', symbol: 'Peace, development, family.' },
                { name: 'Returning Home in Glory', image: 'Return.png', meaning: 'Praises the tradition of studiousness, achievement, and gratitude towards ancestors and homeland.', symbol: 'Achievement, filial piety, tradition.' },
                { name: 'Buffalo Boy Playing Flute', image: 'Buffalo.png', meaning: 'Depicts the simple, peaceful life of farmers, the harmony between humans and nature.', symbol: 'Simplicity, harmony, nature.' },
                { name: 'Mother Hen', image: 'conga.png', meaning: 'Symbol of prosperity, many children and grandchildren, happy family.', symbol: 'Prosperity, family, children.' },
                { name: 'Pigs', image: 'Pig.png', meaning: 'Symbol of abundance, prosperity, development, and yin-yang harmony in life.', symbol: 'Abundance, development, harmony.' }
            ]
        }
    };
}

// Translation function
const t = (key) => {
    const lang = window.GlobalState.language;
    const translation = window.I18N[lang] || window.I18N['en']; // Fallback to English
    return translation[key] || key; // Return key if translation not found
};

class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        // Load any assets needed for the start scene, e.g., background images, buttons
        this.load.image('background', '../backg.png'); // Adjust path as needed
    }

    create() {
        const { width, height } = this.sys.game.canvas;

        this.add.image(width / 2, height / 2, 'background').setDisplaySize(width, height);

        this.add.text(width / 2, height * 0.2, t('game_dongho_quick_title'), {
            fontSize: '48px',
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5);

        // Quick Mode Button
        const quickModeButton = this.add.text(width / 2, height * 0.5, t('game_dongho_quick_start'), {
            fontSize: '32px',
            fill: '#0f0',
            backgroundColor: '#333',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        quickModeButton.on('pointerdown', () => {
            this.scene.start('QuickModeScene');
        });

        // Deep Mode Button
        const deepModeButton = this.add.text(width / 2, height * 0.7, t('game_dongho_deep_start'), {
            fontSize: '32px',
            fill: '#00f',
            backgroundColor: '#333',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        deepModeButton.on('pointerdown', () => {
            this.scene.start('DeepModeScene');
        });
    }
}

class QuickModeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'QuickModeScene' });
        this.paintings = [];
        this.currentPaintingIndex = 0;
        this.score = 0;
    }

    preload() {
        this.paintings = window.I18N[window.GlobalState.language].game_dongho_quick_paintings || window.I18N['en'].game_dongho_quick_paintings;
        this.paintings.forEach(painting => {
            this.load.image(painting.image, painting.image); // Images are in the same directory
        });
    }

    create() {
        const { width, height } = this.sys.game.canvas;

        this.scoreText = this.add.text(width * 0.1, height * 0.1, t('game_dongho_quick_score') + this.score, {
            fontSize: '24px',
            fill: '#fff'
        });

        this.paintingImage = this.add.image(width / 2, height * 0.4, '').setDisplaySize(300, 300);
        this.paintingNameText = this.add.text(width / 2, height * 0.7, '', {
            fontSize: '32px',
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5);

        this.nextButton = this.add.text(width / 2, height * 0.9, t('game_dongho_quick_next'), {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#333',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive().setVisible(false);

        this.nextButton.on('pointerdown', () => {
            this.currentPaintingIndex++;
            if (this.currentPaintingIndex < this.paintings.length) {
                this.showPainting();
            } else {
                this.endGame();
            }
        });

        this.showPainting();
    }

    showPainting() {
        const painting = this.paintings[this.currentPaintingIndex];
        this.paintingImage.setTexture(painting.image);
        this.paintingNameText.setText(painting.name);
        this.nextButton.setVisible(false);
    }

    checkAnswer(isCorrect) {
        if (isCorrect) {
            this.score++;
            this.scoreText.setText(t('game_dongho_quick_score') + this.score);
            this.paintingNameText.setText(t('game_dongho_quick_correct'));
        } else {
            this.paintingNameText.setText(t('game_dongho_quick_wrong'));
        }
        this.nextButton.setVisible(true);
    }

    endGame() {
        const { width, height } = this.sys.game.canvas;
        this.paintingImage.setVisible(false);
        this.paintingNameText.setText(t('game_dongho_quick_score') + this.score + '\n' + t('game_dongho_quick_replay'));

        const replayButton = this.add.text(width / 2, height * 0.8, t('game_dongho_quick_replay'), {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#333',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        replayButton.on('pointerdown', () => {
            this.scene.start('StartScene');
        });
    }
}

class DeepModeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DeepModeScene' });
        this.paintings = [];
        this.currentPaintingIndex = 0;
    }

    preload() {
        this.paintings = window.I18N[window.GlobalState.language].game_dongho_deep_paintings || window.I18N['en'].game_dongho_deep_paintings;
        this.paintings.forEach(painting => {
            this.load.image(painting.image, painting.image); // Images are in the same directory
        });
    }

    create() {
        const { width, height } = this.sys.game.canvas;

        this.paintingImage = this.add.image(width / 2, height * 0.3, '').setDisplaySize(300, 300);
        this.paintingNameText = this.add.text(width / 2, height * 0.6, '', {
            fontSize: '32px',
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5);
        this.paintingMeaningText = this.add.text(width / 2, height * 0.7, '', {
            fontSize: '24px',
            fill: '#fff',
            align: 'center',
            wordWrap: { width: width * 0.8 }
        }).setOrigin(0.5);
        this.paintingSymbolText = this.add.text(width / 2, height * 0.8, '', {
            fontSize: '24px',
            fill: '#fff',
            align: 'center',
            wordWrap: { width: width * 0.8 }
        }).setOrigin(0.5);

        this.nextButton = this.add.text(width / 2, height * 0.9, t('game_dongho_deep_next'), {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#333',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        this.nextButton.on('pointerdown', () => {
            this.currentPaintingIndex++;
            if (this.currentPaintingIndex < this.paintings.length) {
                this.showPainting();
            } else {
                this.scene.start('StartScene'); // Go back to start after all paintings
            }
        });

        this.showPainting();
    }

    showPainting() {
        const painting = this.paintings[this.currentPaintingIndex];
        this.paintingImage.setTexture(painting.image);
        this.paintingNameText.setText(painting.name);
        this.paintingMeaningText.setText(painting.meaning);
        this.paintingSymbolText.setText(painting.symbol);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container', // ID of the div in index.html
    scene: [StartScene, QuickModeScene, DeepModeScene]
};

const game = new Phaser.Game(config);