var _ = require("lodash");

var tests = module.exports;

tests.nameJaAll = {
    locale: 'ja',
    kanji: '柴田是眞',
    given: 'Zeshin',
    given_kana: 'ぜしん',
    surname: 'Shibata',
    surname_kana: 'しばた',
    surname_kanji: '柴田',
    given_kanji: '是眞',
    name: 'Shibata Zeshin II',
    ascii: 'Shibata Zeshin II',
    plain: 'Shibata Zeshin II',
    kana: 'しばたぜしん',
    generation: 2
};

tests.nameJaAll2 = {
    locale: 'ja',
    kanji: '歌川是眞',
    given: 'Zeshin',
    given_kana: 'ぜしん',
    surname: 'Utagawa',
    surname_kana: 'うたがわ',
    surname_kanji: '歌川',
    given_kanji: '是眞',
    name: 'Utagawa Zeshin II',
    ascii: 'Utagawa Zeshin II',
    plain: 'Utagawa Zeshin II',
    kana: 'うたがわぜしん',
    generation: 2
};

tests.nameJaAll3 = {
    locale: 'ja',
    kanji: '歌川国富',
    generation: 3,
    given: 'Kunitomi',
    given_kana: 'くにとみ',
    surname: 'Utagawa',
    surname_kana: 'うたがわ',
    surname_kanji: '歌川'
    given_kanji: '国富',
    name: 'Utagawa Kunitomi III',
    ascii: 'Utagawa Kunitomi III',
    plain: 'Utagawa Kunitomi III',
    kana: 'うたがわくにとみ'
};

tests.nameJaNoKanji = _.omit(nameJaAll,
    ['kanji', 'given_kanji', 'surname_kanji']);

tests.nameJaNoKanji2 = _.omit(nameJaAll2,
    ['kanji', 'given_kanji', 'surname_kanji']);

tests.nameJaNoKanji3 = _.omit(nameJaAll3,
    ['kanji', 'given_kanji', 'surname_kanji']);

tests.nameJaNoSurname = {
    locale: 'ja',
    kanji: '是眞',
    given: 'Zeshin',
    given_kana: 'ぜしん',
    given_kanji: '是眞',
    name: 'Zeshin II',
    ascii: 'Zeshin II',
    plain: 'Zeshin II',
    kana: 'ぜしん',
    generation: 2
};

tests.nameJaNoSurname2 = {
    locale: 'ja',
    kanji: '是眞',
    given: 'Zeshin',
    given_kana: 'ぜしん',
    given_kanji: '是眞',
    name: 'Zeshin III',
    ascii: 'Zeshin III',
    plain: 'Zeshin III',
    kana: 'ぜしん',
    generation: 3
};

tests.nameJaNoSurname2 = {
    locale: 'ja',
    kanji: '是眞',
    given: 'Zeshin',
    given_kana: 'ぜしん',
    given_kanji: '是眞',
    name: 'Zeshin',
    ascii: 'Zeshin',
    plain: 'Zeshin',
    kana: 'ぜしん'
};

tests.nameJaGivenOnly = {
    locale: 'ja',
    given: 'Zeshin',
    given_kana: 'ぜしん',
    name: 'Zeshin',
    ascii: 'Zeshin',
    plain: 'Zeshin',
    kana: 'ぜしん'
};

tests.nameJaGivenOnly2 = {
    locale: 'ja',
    given: 'Shun\'ei',
    given_kana: 'しゅんえい',
    name: 'Shun\'ei',
    ascii: 'Shun\'ei',
    plain: 'Shun\'ei',
    kana: 'しゅんえい'
};

tests.nameEn = {
    locale: '',
    given: 'Charles',
    surname: 'Bartlett',
    name: 'Charles Bartlett',
    ascii: 'Charles Bartlett',
    plain: 'Charles Bartlett'
};

tests.nameEn2 = {
    locale: '',
    given: 'Charles',
    surname: 'Smith',
    name: 'Charles Smith',
    ascii: 'Charles Smith',
    plain: 'Charles Smith'
};

tests.nameEn3 = {
    locale: '',
    given: 'Ted',
    surname: 'Ted',
    name: 'Ted Smith',
    ascii: 'Ted Smith',
    plain: 'Ted Smith'
};

tests.nameKanji = {
    locale: 'ja',
    kanji: '歌川広重',
    surname_kanji: '歌川',
    given_kanji: '広重'
};

tests.nameKanji2 = {
    locale: 'ja',
    kanji: '柴田広重',
    surname_kanji: '柴田',
    given_kanji: '広重'
};

tests.nameKanji3 = {
    locale: 'ja',
    kanji: '歌川国郷',
    surname_kanji: '歌川',
    given_kanji: '国郷'
};
