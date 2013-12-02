var _ = require("lodash");

module.exports = {
    names: {
        jaAll: {
            locale: "ja",
            kanji: "柴田是眞",
            given: "Zeshin",
            given_kana: "ぜしん",
            surname: "Shibata",
            surname_kana: "しばた",
            surname_kanji: "柴田",
            given_kanji: "是眞",
            name: "Shibata Zeshin II",
            ascii: "Shibata Zeshin II",
            plain: "Shibata Zeshin II",
            kana: "しばたぜしん",
            generation: 2
        },

        jaAll2: {
            locale: "ja",
            kanji: "歌川是眞",
            given: "Zeshin",
            given_kana: "ぜしん",
            surname: "Utagawa",
            surname_kana: "うたがわ",
            surname_kanji: "歌川",
            given_kanji: "是眞",
            name: "Utagawa Zeshin II",
            ascii: "Utagawa Zeshin II",
            plain: "Utagawa Zeshin II",
            kana: "うたがわぜしん",
            generation: 2
        },

        jaAll3: {
            locale: "ja",
            kanji: "歌川国富",
            generation: 3,
            given: "Kunitomi",
            given_kana: "くにとみ",
            surname: "Utagawa",
            surname_kana: "うたがわ",
            surname_kanji: "歌川",
            given_kanji: "国富",
            name: "Utagawa Kunitomi III",
            ascii: "Utagawa Kunitomi III",
            plain: "Utagawa Kunitomi III",
            kana: "うたがわくにとみ"
        },

        jaAll4: {
            locale: "ja",
            kanji: "柴田是眞",
            given: "Zeshin",
            given_kana: "ぜしん",
            surname: "Shibata",
            surname_kana: "しばた",
            surname_kanji: "柴田",
            given_kanji: "是眞",
            name: "Shibata Zeshin",
            ascii: "Shibata Zeshin",
            plain: "Shibata Zeshin",
            kana: "しばたぜしん"
        },

        jaNoSurname: {
            locale: "ja",
            kanji: "是眞",
            given: "Zeshin",
            given_kana: "ぜしん",
            given_kanji: "是眞",
            name: "Zeshin II",
            ascii: "Zeshin II",
            plain: "Zeshin II",
            kana: "ぜしん",
            generation: 2
        },

        jaNoSurname2: {
            locale: "ja",
            kanji: "是眞",
            given: "Zeshin",
            given_kana: "ぜしん",
            given_kanji: "是眞",
            name: "Zeshin III",
            ascii: "Zeshin III",
            plain: "Zeshin III",
            kana: "ぜしん",
            generation: 3
        },

        jaNoSurname3: {
            locale: "ja",
            kanji: "是眞",
            given: "Zeshin",
            given_kana: "ぜしん",
            given_kanji: "是眞",
            name: "Zeshin",
            ascii: "Zeshin",
            plain: "Zeshin",
            kana: "ぜしん"
        },

        jaGivenOnly: {
            locale: "ja",
            given: "Zeshin",
            given_kana: "ぜしん",
            name: "Zeshin",
            ascii: "Zeshin",
            plain: "Zeshin",
            kana: "ぜしん"
        },

        jaGivenOnly2: {
            locale: "ja",
            given: "Shun\'ei",
            given_kana: "しゅんえい",
            name: "Shun\'ei",
            ascii: "Shun\'ei",
            plain: "Shun\'ei",
            kana: "しゅんえい"
        },

        en: {
            locale: "",
            given: "Charles",
            surname: "Bartlett",
            name: "Charles Bartlett",
            ascii: "Charles Bartlett",
            plain: "Charles Bartlett"
        },

        en2: {
            locale: "",
            given: "Charles",
            surname: "Smith",
            name: "Charles Smith",
            ascii: "Charles Smith",
            plain: "Charles Smith"
        },

        en3: {
            locale: "",
            given: "Ted",
            surname: "Smith",
            name: "Ted Smith",
            ascii: "Ted Smith",
            plain: "Ted Smith"
        },

        kanji: {
            locale: "ja",
            kanji: "歌川広重",
            surname_kanji: "歌川",
            given_kanji: "広重"
        },

        kanji2: {
            locale: "ja",
            kanji: "柴田広重",
            surname_kanji: "柴田",
            given_kanji: "広重"
        },

        kanji3: {
            locale: "ja",
            kanji: "歌川国富",
            surname_kanji: "歌川",
            given_kanji: "国富"
        },

        kanji4: {
            locale: "ja",
            kanji: "柴田是眞",
            surname_kanji: "柴田",
            given_kanji: "是眞",
            generation: 2
        },

        kanji5: {
            locale: "ja",
            kanji: "柴田是眞",
            surname_kanji: "柴田",
            given_kanji: "是眞"
        },

        none: {}
    },

    dates: {
        all: {
            start: 1700,
            start_ca: true,
            end: 1800,
            end_ca: true
        },

        all2: {
            start: 1700,
            start_ca: true,
            end: 1801,
            end_ca: true
        },

        all3: {
            start: 1701,
            start_ca: true,
            end: 1800,
            end_ca: true
        },

        noCA: {
            start: 1700,
            end: 1800
        },

        startOnly: {
            start: 1700
        },

        endOnly: {
            end: 1800
        },

        current: {
            start: 1984,
            current: true
        },

        none: {}
    },

    nameMatches: {
        jaAll: {
            jaAll2: 1,
            jaAll3: 0,
            jaAll4: 0,
            jaNoSurname: 1,
            jaNoSurname2: 0,
            jaNoSurname3: 0,
            jaGivenOnly: 0,
            jaGivenOnly2: 0,
            en: 0,
            en2: 0,
            en3: 0,
            kanji: 0,
            kanji2: 0,
            kanji3: 0,
            kanji4: 2,
            kanji5: 0,
            none: 0
        },

        jaAll2: {
            jaAll3: 0,
            jaAll4: 0,
            jaNoSurname: 1,
            jaNoSurname2: 0,
            jaNoSurname3: 0,
            jaGivenOnly: 0,
            jaGivenOnly2: 0,
            en: 0,
            en2: 0,
            en3: 0,
            kanji: 0,
            kanji2: 0,
            kanji3: 0,
            kanji4: 1,
            kanji5: 0,
            none: 0
        },

        jaAll3: {
            jaAll4: 0,
            jaNoSurname: 0,
            jaNoSurname2: 0,
            jaNoSurname3: 0,
            jaGivenOnly: 0,
            jaGivenOnly2: 0,
            en: 0,
            en2: 0,
            en3: 0,
            kanji: 0,
            kanji2: 0,
            kanji3: 0,
            kanji4: 0,
            kanji5: 0,
            none: 0
        },

        jaAll4: {
            jaNoSurname: 0,
            jaNoSurname2: 0,
            jaNoSurname3: 1,
            jaGivenOnly: 1,
            jaGivenOnly2: 0,
            en: 0,
            en2: 0,
            en3: 0,
            kanji: 0,
            kanji2: 0,
            kanji3: 0,
            kanji4: 0,
            kanji5: 2,
            none: 0
        },

        jaNoSurname: {
            jaNoSurname2: 0,
            jaNoSurname3: 0,
            jaGivenOnly: 0,
            jaGivenOnly2: 0,
            en: 0,
            en2: 0,
            en3: 0,
            kanji: 0,
            kanji2: 0,
            kanji3: 0,
            kanji4: 1,
            kanji5: 0,
            none: 0
        },

        jaNoSurname2: {
            jaNoSurname3: 0,
            jaGivenOnly: 0,
            jaGivenOnly2: 0,
            en: 0,
            en2: 0,
            en3: 0,
            kanji: 0,
            kanji2: 0,
            kanji3: 0,
            kanji4: 0,
            kanji5: 0,
            none: 0
        },

        jaNoSurname3: {
            jaGivenOnly: 2,
            jaGivenOnly2: 0,
            en: 0,
            en2: 0,
            en3: 0,
            kanji: 0,
            kanji2: 0,
            kanji3: 0,
            kanji4: 0,
            kanji5: 1,
            none: 0
        },

        jaGivenOnly: {
            jaGivenOnly2: 0,
            en: 0,
            en2: 0,
            en3: 0,
            kanji: 0,
            kanji2: 0,
            kanji3: 0,
            kanji4: 0,
            kanji5: 0,
            none: 0
        },

        jaGivenOnly2: {
            en: 0,
            en2: 0,
            en3: 0,
            kanji: 0,
            kanji2: 0,
            kanji3: 0,
            kanji4: 0,
            kanji5: 0,
            none: 0
        },

        en: {
            en2: 0,
            en3: 0,
            kanji: 0,
            kanji2: 0,
            kanji3: 0,
            kanji4: 0,
            kanji5: 0,
            none: 0
        },

        en2: {
            en3: 0,
            kanji: 0,
            kanji2: 0,
            kanji3: 0,
            kanji4: 0,
            kanji5: 0,
            none: 0
        },

        en3: {
            kanji: 0,
            kanji2: 0,
            kanji3: 0,
            kanji4: 0,
            kanji5: 0,
            none: 0
        },

        kanji: {
            kanji2: 1,
            kanji3: 0,
            kanji4: 0,
            kanji5: 0,
            none: 0
        },

        kanji2: {
            kanji3: 0,
            kanji4: 0,
            kanji5: 0,
            none: 0
        },

        kanji3: {
            kanji4: 0,
            kanji5: 0,
            none: 0
        },

        kanji4: {
            kanji5: 0,
            none: 0
        },

        kanji5: {
            none: 0
        }
    },

    dateMatches: {
        all: {
            all2: 1,
            all3: 1,
            noCA: 2,
            startOnly: 1,
            endOnly: 1,
            current: 0,
            none: undefined
        },

        all2: {
            all3: 0,
            noCA: 1,
            startOnly: 1,
            endOnly: 0,
            current: 0,
            none: undefined
        },

        all3: {
            noCA: 1,
            startOnly: 0,
            endOnly: 1,
            current: 0,
            none: undefined
        },

        noCA: {
            startOnly: 1,
            endOnly: 1,
            current: 0,
            none: undefined
        },

        startOnly: {
            endOnly: undefined,
            current: 0,
            none: undefined
        },

        endOnly: {
            current: 0,
            none: undefined
        },

        current: {
            none: 1
        },

        none: {}
    },

    bioMatches: {
        name: [
            ["jaAll", "en"],
            ["jaAll", "jaAll2"],
            ["jaAll", "jaAll"]
        ],

        date: [
            ["all", "current"],
            ["all", "all2"],
            ["all", "all"]
        ]
    },

    nameMerges: {
        jaAll: {
            jaAll: true,
            jaAll2: false,
            jaAll3: false,
            jaAll4: false,
            jaNoSurname: true,
            jaNoSurname2: false,
            jaNoSurname3: false,
            jaGivenOnly: false,
            jaGivenOnly2: false,
            en: false,
            en2: false,
            en3: false,
            kanji: false,
            kanji2: false,
            kanji3: false,
            kanji4: true,
            kanji5: false,
            none: true
        },

        jaAll2: {
            jaAll: false,
            jaAll2: true,
            jaAll3: false,
            jaAll4: false,
            jaNoSurname: true,
            jaNoSurname2: false,
            jaNoSurname3: false,
            jaGivenOnly: false,
            jaGivenOnly2: false,
            en: false,
            en2: false,
            en3: false,
            kanji: false,
            kanji2: false,
            kanji3: false,
            kanji4: { generation: 2,
                given_kanji: '是眞',
                surname_kanji: '柴田',
                kanji: '柴田是眞',
                locale: 'ja',
                given: 'Zeshin',
                given_kana: 'ぜしん',
                name: 'Zeshin II',
                ascii: 'Zeshin II',
                plain: 'Zeshin II',
                kana: 'ぜしん' },
            kanji5: false,
            none: true
        },

        jaAll3: {
            jaAll: false,
            jaAll2: false,
            jaAll3: true,
            jaAll4: false,
            jaNoSurname: false,
            jaNoSurname2: false,
            jaNoSurname3: false,
            jaGivenOnly: false,
            jaGivenOnly2: false,
            en: false,
            en2: false,
            en3: false,
            kanji: false,
            kanji2: false,
            kanji3: false,
            kanji4: false,
            kanji5: false,
            none: true
        },

        jaAll4: {
            jaAll: false,
            jaAll2: false,
            jaAll3: false,
            jaAll4: true,
            jaNoSurname: false,
            jaNoSurname2: false,
            jaNoSurname3: true,
            jaGivenOnly: true,
            jaGivenOnly2: false,
            en: false,
            en2: false,
            en3: false,
            kanji: false,
            kanji2: false,
            kanji3: false,
            kanji4: false,
            kanji5: true,
            none: true
        },

        jaNoSurname: {
            jaAll: false,
            jaAll2: false,
            jaAll3: false,
            jaAll4: false,
            jaNoSurname: true,
            jaNoSurname2: false,
            jaNoSurname3: false,
            jaGivenOnly: false,
            jaGivenOnly2: false,
            en: false,
            en2: false,
            en3: false,
            kanji: false,
            kanji2: false,
            kanji3: false,
            kanji4: { generation: 2,
                kana: 'ぜしん',
                plain: 'Zeshin II',
                ascii: 'Zeshin II',
                name: 'Zeshin II',
                given_kanji: '是眞',
                given_kana: 'ぜしん',
                given: 'Zeshin',
                kanji: '柴田是眞',
                locale: 'ja',
                surname_kanji: '柴田' },
            kanji5: false,
            none: true
        },

        jaNoSurname2: {
            jaAll: false,
            jaAll2: false,
            jaAll3: false,
            jaAll4: false,
            jaNoSurname: false,
            jaNoSurname2: true,
            jaNoSurname3: false,
            jaGivenOnly: false,
            jaGivenOnly2: false,
            en: false,
            en2: false,
            en3: false,
            kanji: false,
            kanji2: false,
            kanji3: false,
            kanji4: false,
            kanji5: false,
            none: true
        },

        jaNoSurname3: {
            jaAll: false,
            jaAll2: false,
            jaAll3: false,
            jaAll4: false,
            jaNoSurname: false,
            jaNoSurname2: false,
            jaNoSurname3: true,
            jaGivenOnly: true,
            jaGivenOnly2: false,
            en: false,
            en2: false,
            en3: false,
            kanji: false,
            kanji2: false,
            kanji3: false,
            kanji4: false,
            kanji5: { kana: 'ぜしん',
                plain: 'Zeshin',
                ascii: 'Zeshin',
                name: 'Zeshin',
                given_kanji: '是眞',
                given_kana: 'ぜしん',
                given: 'Zeshin',
                kanji: '柴田是眞',
                locale: 'ja',
                surname_kanji: '柴田' },
            none: true
        },

        jaGivenOnly: {
            jaAll: false,
            jaAll2: false,
            jaAll3: false,
            jaAll4: false,
            jaNoSurname: false,
            jaNoSurname2: false,
            jaNoSurname3: false,
            jaGivenOnly: true,
            jaGivenOnly2: false,
            en: false,
            en2: false,
            en3: false,
            kanji: false,
            kanji2: false,
            kanji3: false,
            kanji4: false,
            kanji5: false,
            none: true
        },

        jaGivenOnly2: {
            jaAll: false,
            jaAll2: false,
            jaAll3: false,
            jaAll4: false,
            jaNoSurname: false,
            jaNoSurname2: false,
            jaNoSurname3: false,
            jaGivenOnly: false,
            jaGivenOnly2: true,
            en: false,
            en2: false,
            en3: false,
            kanji: false,
            kanji2: false,
            kanji3: false,
            kanji4: false,
            kanji5: false,
            none: true
        },

        en: {
            jaAll: false,
            jaAll2: false,
            jaAll3: false,
            jaAll4: false,
            jaNoSurname: false,
            jaNoSurname2: false,
            jaNoSurname3: false,
            jaGivenOnly: false,
            jaGivenOnly2: false,
            en: true,
            en2: false,
            en3: false,
            kanji: false,
            kanji2: false,
            kanji3: false,
            kanji4: false,
            kanji5: false,
            none: true
        },

        en2: {
            jaAll: false,
            jaAll2: false,
            jaAll3: false,
            jaAll4: false,
            jaNoSurname: false,
            jaNoSurname2: false,
            jaNoSurname3: false,
            jaGivenOnly: false,
            jaGivenOnly2: false,
            en: false,
            en2: true,
            en3: false,
            kanji: false,
            kanji2: false,
            kanji3: false,
            kanji4: false,
            kanji5: false,
            none: true
        },

        en3: {
            jaAll: false,
            jaAll2: false,
            jaAll3: false,
            jaAll4: false,
            jaNoSurname: false,
            jaNoSurname2: false,
            jaNoSurname3: false,
            jaGivenOnly: false,
            jaGivenOnly2: false,
            en: false,
            en2: false,
            en3: true,
            kanji: false,
            kanji2: false,
            kanji3: false,
            kanji4: false,
            kanji5: false,
            none: true
        },

        kanji: {
            jaAll: false,
            jaAll2: false,
            jaAll3: false,
            jaAll4: false,
            jaNoSurname: false,
            jaNoSurname2: false,
            jaNoSurname3: false,
            jaGivenOnly: false,
            jaGivenOnly2: false,
            en: false,
            en2: false,
            en3: false,
            kanji: true,
            kanji2: false,
            kanji3: false,
            kanji4: false,
            kanji5: false,
            none: true
        },

        kanji2: {
            jaAll: false,
            jaAll2: false,
            jaAll3: false,
            jaAll4: false,
            jaNoSurname: false,
            jaNoSurname2: false,
            jaNoSurname3: false,
            jaGivenOnly: false,
            jaGivenOnly2: false,
            en: false,
            en2: false,
            en3: false,
            kanji: false,
            kanji2: true,
            kanji3: false,
            kanji4: false,
            kanji5: false,
            none: true
        },

        kanji3: {
            jaAll: false,
            jaAll2: false,
            jaAll3: false,
            jaAll4: false,
            jaNoSurname: false,
            jaNoSurname2: false,
            jaNoSurname3: false,
            jaGivenOnly: false,
            jaGivenOnly2: false,
            en: false,
            en2: false,
            en3: false,
            kanji: false,
            kanji2: false,
            kanji3: true,
            kanji4: false,
            kanji5: false,
            none: true
        },

        kanji4: {
            jaAll: false,
            jaAll2: false,
            jaAll3: false,
            jaAll4: false,
            jaNoSurname: { generation: 2,
                kana: 'ぜしん',
                plain: 'Zeshin II',
                ascii: 'Zeshin II',
                name: 'Zeshin II',
                given_kanji: '是眞',
                given_kana: 'ぜしん',
                given: 'Zeshin',
                kanji: '柴田是眞',
                locale: 'ja',
                surname_kanji: '柴田' },
            jaNoSurname2: false,
            jaNoSurname3: false,
            jaGivenOnly: false,
            jaGivenOnly2: false,
            en: false,
            en2: false,
            en3: false,
            kanji: false,
            kanji2: false,
            kanji3: false,
            kanji4: true,
            kanji5: false,
            none: true
        },

        kanji5: {
            jaAll: false,
            jaAll2: false,
            jaAll3: false,
            jaAll4: false,
            jaNoSurname: false,
            jaNoSurname2: false,
            jaNoSurname3: { kana: 'ぜしん',
                plain: 'Zeshin',
                ascii: 'Zeshin',
                name: 'Zeshin',
                given_kanji: '是眞',
                given_kana: 'ぜしん',
                given: 'Zeshin',
                kanji: '柴田是眞',
                locale: 'ja',
                surname_kanji: '柴田' },
            jaGivenOnly: false,
            jaGivenOnly2: false,
            en: false,
            en2: false,
            en3: false,
            kanji: false,
            kanji2: false,
            kanji3: false,
            kanji4: false,
            kanji5: true,
            none: true
        },

        none: {
            jaAll: false,
            jaAll2: false,
            jaAll3: false,
            jaAll4: false,
            jaNoSurname: false,
            jaNoSurname2: false,
            jaNoSurname3: false,
            jaGivenOnly: false,
            jaGivenOnly2: false,
            en: false,
            en2: false,
            en3: false,
            kanji: false,
            kanji2: false,
            kanji3: true,
            kanji4: false,
            kanji5: false,
            none: true
        }
    },

    dateMerges: {
        all: {
            all: true,
            all2: false,
            all3: false,
            noCA: true,
            startOnly: true,
            endOnly: true,
            current: false,
            none: true
        },

        all2: {
            all: false,
            all2: true,
            all3: false,
            noCA: {
                start: 1700,
                start_ca: true,
                end: 1800
            },
            startOnly: true,
            endOnly: {
                start: 1700,
                start_ca: true,
                end: 1800
            },
            current: false,
            none: true
        },

        all3: {
            all: false,
            all2: false,
            all3: true,
            noCA: {
                start: 1700,
                end: 1800,
                end_ca: true
            },
            startOnly: {
                start: 1700,
                end: 1800,
                end_ca: true
            },
            endOnly: true,
            current: false,
            none: true
        },

        noCA: {
            all: false,
            all2: {
                start: 1700,
                start_ca: true,
                end: 1801,
                end_ca: true
            },
            all3: {
                start: 1701,
                start_ca: true,
                end: 1800,
                end_ca: true
            },
            noCA: true,
            startOnly: true,
            endOnly: true,
            current: false,
            none: true
        },

        startOnly: {
            all: false,
            all2: false,
            all3: false,
            noCA: false,
            startOnly: true,
            endOnly: {
                start: 1700,
                end: 1800
            },
            current: false,
            none: true
        },

        endOnly: {
            all: false,
            all2: false,
            all3: false,
            noCA: false,
            startOnly: {
                start: 1700,
                end: 1800
            },
            endOnly: true,
            current: false,
            none: true
        },

        current: {
            all: false,
            all2: false,
            all3: false,
            noCA: false,
            startOnly: {
                start: 1700,
                current: true
            },
            endOnly: {
                // TODO: May want to prevent this
                start: 1984,
                end: 1800
            },
            current: true,
            none: true
        },

        none: {
            all: false,
            all2: false,
            all3: false,
            noCA: false,
            startOnly: false,
            endOnly: false,
            current: false,
            none: true
        }
    }
};