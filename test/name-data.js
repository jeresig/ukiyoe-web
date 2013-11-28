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
            given: "Shun\"ei",
            given_kana: "しゅんえい",
            name: "Shun\"ei",
            ascii: "Shun\"ei",
            plain: "Shun\"ei",
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
            surname: "Ted",
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
        }
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
        }
    }
};

_.extend(module.exports.names, {
    jaNoKanji: _.omit(module.exports.names.jaAll,
        ["kanji", "given_kanji", "surname_kanji"]),

    jaNoKanji2: _.omit(module.exports.names.jaAll2,
        ["kanji", "given_kanji", "surname_kanji"]),

    jaNoKanji3: _.omit(module.exports.names.jaAll3,
        ["kanji", "given_kanji", "surname_kanji"])
});

module.exports.nameMatches = {
    jaAll: {
        jaAll2: 1,
		jaAll3: 0,
		jaAll4: 0,
		jaNoSurname: 1,
		jaNoSurname2: 0,
		jaNoSurname3: 0,
		jaGivenOnly: 0,
		jaGivenOnly2: 0
		en: 0,
		en2: 0,
		en3: 0
		kanji: 0,
		kanji2: 0,
		kanji3: 0,
		kanji4: 2,
		kanji5: 0
    },

	jaAll2: {
		jaAll3: 0,
		jaAll4: 0,
		jaNoSurname: 1,
		jaNoSurname2: 0,
		jaNoSurname3: 0,
		jaGivenOnly: 0,
		jaGivenOnly2: 0
		en: 0,
		en2: 0,
		en3: 0
		kanji: 0,
		kanji2: 0,
		kanji3: 0,
		kanji4: 1,
		kanji5: 0
	},

	jaAll3: {
		jaAll4: 0,
		jaNoSurname: 0,
		jaNoSurname2: 0,
		jaNoSurname3: 0,
		jaGivenOnly: 0,
		jaGivenOnly2: 0
		en: 0,
		en2: 0,
		en3: 0
		kanji: 0,
		kanji2: 0,
		kanji3: 2,
		kanji4: 0
		kanji5: 0
	},
	
	jaAll4: {
		jaNoSurname: 0,
		jaNoSurname2: 0,
		jaNoSurname3: 1,
		jaGivenOnly: 1,
		jaGivenOnly2: 0
		en: 0,
		en2: 0,
		en3: 0
		kanji: 0,
		kanji2: 0,
		kanji3: 0,
		kanji4: 0,
		kanji5: 2
	},
	
	jaNoSurname: {
		jaNoSurname2: 0,
		jaNoSurname3: 0,
		jaGivenOnly: 0,
		jaGivenOnly2: 0
		en: 0,
		en2: 0,
		en3: 0
		kanji: 0,
		kanji2: 0,
		kanji3: 0,
		kanji4: 1,
		kanji5: 0
	},
	
	jaNoSurname2: {
		jaNoSurname3: 0,
		jaGivenOnly: 0,
		jaGivenOnly2: 0
		en: 0,
		en2: 0,
		en3: 0
		kanji: 0,
		kanji2: 0,
		kanji3: 0,
		kanji4: 0,
		kanji5: 0
	},
	
	jaNoSurname3: {
		jaGivenOnly: 0,
		jaGivenOnly2: 0
		en: 0,
		en2: 0,
		en3: 0
		kanji: 0,
		kanji2: 0,
		kanji3: 0,
		kanji4: 0,
		kanji5: 1
	},
	
	jaGivenOnly: {
		jaGivenOnly2: 0
		en: 0,
		en2: 0,
		en3: 0
		kanji: 0,
		kanji2: 0,
		kanji3: 0,
		kanji4: 0,
		kanji5: 0
	},
	
	jaGivenOnly2: {
		en: 0,
		en2: 0,
		en3: 0
		kanji: 0,
		kanji2: 0,
		kanji3: 0,
		kanji4: 0,
		kanji5: 0
	},
	
	en: {
		en2: 0,
		en3: 0
		kanji: 0,
		kanji2: 0,
		kanji3: 0,
		kanji4: 0,
		kanji5: 0
	},
	
	en2: {
		en3: 0
		kanji: 0,
		kanji2: 0,
		kanji3: 0,
		kanji4: 0,
		kanji5: 0
	},
	
	en3: {
		kanji: 0,
		kanji2: 0,
		kanji3: 0,
		kanji4: 0,
		kanji5: 0
	},
	
	kanji: {
		kanji2: 1,
		kanji3: 0,
		kanji4: 0,
		kanji5: 0
	},
	
	kanji2: {
		kanji3: 0,
		kanji4: 0,
		kanji5: 0
	},
	
	kanji3: {
		kanji4: 0,
		kanji5: 0
	},
	
	kanji4: {
		kanji5: 0
	}
};

module.exports.dateMatches = {
	all: {
		all2: 1,
		all3: 1,
		noCA: 2,
		startOnly: 2,
		endOnly: 2,
		current: 0
	},
	
	all2: {
		all3: 0,
		noCA: 1,
		startOnly: 2,
		endOnly: 0,
		current: 0
	},

	all3: {
		noCA: 1,
		startOnly: 0,
		endOnly: 2,
		current: 0
	},

	noCA: {
		startOnly: 0,
		endOnly: 0,
		current: 0
	},

	startOnly: {
		endOnly: 0,
		current: 0
	},
	
	endOnly: {
		current: 0
	}
};