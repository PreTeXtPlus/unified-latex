Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let _unified_latex_unified_latex_util_match = require("@unified-latex/unified-latex-util-match");
let _unified_latex_unified_latex_util_pegjs = require("@unified-latex/unified-latex-util-pegjs");
let _unified_latex_unified_latex_util_visit = require("@unified-latex/unified-latex-util-visit");
//#region ../support-tables/ligature-macros.json
var ligature_macros_default = /* @__PURE__ */ JSON.parse("[[\"\\\\-\",\"­\"],[\"\\\\. A\",\"Ȧ\"],[\"\\\\. a\",\"ȧ\"],[\"\\\\. B\",\"Ḃ\"],[\"\\\\. b\",\"ḃ\"],[\"\\\\. C\",\"Ċ\"],[\"\\\\. c\",\"ċ\"],[\"\\\\. D\",\"Ḋ\"],[\"\\\\. d\",\"ḋ\"],[\"\\\\. E\",\"Ė\"],[\"\\\\. e\",\"ė\"],[\"\\\\. F\",\"Ḟ\"],[\"\\\\. f\",\"ḟ\"],[\"\\\\. G\",\"Ġ\"],[\"\\\\. g\",\"ġ\"],[\"\\\\. I\",\"İ\"],[\"\\\\. M\",\"Ṁ\"],[\"\\\\. m\",\"ṁ\"],[\"\\\\. O\",\"Ȯ\"],[\"\\\\. o\",\"ȯ\"],[\"\\\\. P\",\"Ṗ\"],[\"\\\\. p\",\"ṗ\"],[\"\\\\. S\",\"Ṡ\"],[\"\\\\. s\",\"ṡ\"],[\"\\\\. T\",\"Ṫ\"],[\"\\\\. t\",\"ṫ\"],[\"\\\\. Z\",\"Ż\"],[\"\\\\. z\",\"ż\"],[\"\\\\\\\" \\\\i\",\"ï\"],[\"\\\\\\\" A\",\"Ä\"],[\"\\\\\\\" a\",\"ä\"],[\"\\\\\\\" E\",\"Ë\"],[\"\\\\\\\" e\",\"ë\"],[\"\\\\\\\" I\",\"Ï\"],[\"\\\\\\\" i\",\"ï\"],[\"\\\\\\\" O\",\"Ö\"],[\"\\\\\\\" o\",\"ö\"],[\"\\\\\\\" U\",\"Ü\"],[\"\\\\\\\" u\",\"ü\"],[\"\\\\\\\" W\",\"Ẅ\"],[\"\\\\\\\" w\",\"ẅ\"],[\"\\\\\\\" y\",\"ÿ\"],[\"\\\\\\\" Y\",\"Ÿ\"],[\"\\\\' A\",\"Á\"],[\"\\\\' a\",\"á\"],[\"\\\\' C\",\"Ć\"],[\"\\\\' c\",\"ć\"],[\"\\\\' E\",\"É\"],[\"\\\\' e\",\"é\"],[\"\\\\' G\",\"Ǵ\"],[\"\\\\' g\",\"ǵ\"],[\"\\\\' I\",\"Í\"],[\"\\\\' i\",\"í\"],[\"\\\\' \\\\i\",\"í\"],[\"\\\\' \\\\j\",\"j́\"],[\"\\\\' K\",\"Ḱ\"],[\"\\\\' k\",\"ḱ\"],[\"\\\\' L\",\"Ĺ\"],[\"\\\\' \\\\L\",\"Ł́\"],[\"\\\\' l\",\"ĺ\"],[\"\\\\' \\\\l\",\"ł́\"],[\"\\\\' M\",\"Ḿ\"],[\"\\\\' m\",\"ḿ\"],[\"\\\\' N\",\"Ń\"],[\"\\\\' n\",\"ń\"],[\"\\\\' O\",\"Ó\"],[\"\\\\' \\\\O\",\"Ǿ\"],[\"\\\\' o\",\"ó\"],[\"\\\\' \\\\o\",\"ǿ\"],[\"\\\\' P\",\"Ṕ\"],[\"\\\\' p\",\"ṕ\"],[\"\\\\' R\",\"Ŕ\"],[\"\\\\' r\",\"ŕ\"],[\"\\\\' S\",\"Ś\"],[\"\\\\' s\",\"ś\"],[\"\\\\' U\",\"Ú\"],[\"\\\\' u\",\"ú\"],[\"\\\\' W\",\"Ẃ\"],[\"\\\\' w\",\"ẃ\"],[\"\\\\' Y\",\"Ý\"],[\"\\\\' y\",\"ý\"],[\"\\\\' Z\",\"Ź\"],[\"\\\\' z\",\"ź\"],[\"\\\\^ \\\\i\",\"î\"],[\"\\\\^ \\\\j\",\"ĵ\"],[\"\\\\^ A\",\"Â\"],[\"\\\\^ a\",\"â\"],[\"\\\\^ C\",\"Ĉ\"],[\"\\\\^ c\",\"ĉ\"],[\"\\\\^ E\",\"Ê\"],[\"\\\\^ e\",\"ê\"],[\"\\\\^ G\",\"Ĝ\"],[\"\\\\^ g\",\"ĝ\"],[\"\\\\^ H\",\"Ĥ\"],[\"\\\\^ h\",\"ĥ\"],[\"\\\\^ I\",\"Î\"],[\"\\\\^ J\",\"Ĵ\"],[\"\\\\^ O\",\"Ô\"],[\"\\\\^ o\",\"ô\"],[\"\\\\^ S\",\"Ŝ\"],[\"\\\\^ s\",\"ŝ\"],[\"\\\\^ U\",\"Û\"],[\"\\\\^ u\",\"û\"],[\"\\\\^ W\",\"Ŵ\"],[\"\\\\^ w\",\"ŵ\"],[\"\\\\^ Y\",\"Ŷ\"],[\"\\\\^ y\",\"ŷ\"],[\"\\\\~ \\\\i\",\"ĩ\"],[\"\\\\~ A\",\"Ã\"],[\"\\\\~ a\",\"ã\"],[\"\\\\~ I\",\"Ĩ\"],[\"\\\\~ N\",\"Ñ\"],[\"\\\\~ n\",\"ñ\"],[\"\\\\~ O\",\"Õ\"],[\"\\\\~ o\",\"õ\"],[\"\\\\~ U\",\"Ũ\"],[\"\\\\~ u\",\"ũ\"],[\"\\\\AE\",\"Æ\"],[\"\\\\ae\",\"æ\"],[\"\\\\c \\\\ \",\"¸\"],[\"\\\\c C\",\"Ç\"],[\"\\\\c c\",\"ç\"],[\"\\\\c E\",\"Ȩ\"],[\"\\\\c e\",\"ȩ\"],[\"\\\\c G\",\"Ģ\"],[\"\\\\c g\",\"ģ\"],[\"\\\\c K\",\"Ķ\"],[\"\\\\c k\",\"ķ\"],[\"\\\\c L\",\"Ļ\"],[\"\\\\c l\",\"ļ\"],[\"\\\\c N\",\"Ņ\"],[\"\\\\c n\",\"ņ\"],[\"\\\\c R\",\"Ŗ\"],[\"\\\\c r\",\"ŗ\"],[\"\\\\c S\",\"Ş\"],[\"\\\\c s\",\"ş\"],[\"\\\\c T\",\"Ţ\"],[\"\\\\c t\",\"ţ\"],[\"\\\\CYRA\",\"А\"],[\"\\\\cyra\",\"а\"],[\"\\\\CYRABHCH\",\"Ҽ\"],[\"\\\\cyrabhch\",\"ҽ\"],[\"\\\\CYRABHCHDSC\",\"Ҿ\"],[\"\\\\cyrabhchdsc\",\"ҿ\"],[\"\\\\CYRABHDZE\",\"Ӡ\"],[\"\\\\cyrabhdze\",\"ӡ\"],[\"\\\\CYRABHHA\",\"Ҩ\"],[\"\\\\cyrabhha\",\"ҩ\"],[\"\\\\CYRAE\",\"Ӕ\"],[\"\\\\cyrae\",\"ӕ\"],[\"\\\\CYRB\",\"Б\"],[\"\\\\cyrb\",\"б\"],[\"\\\\CYRBYUS\",\"Ѫ\"],[\"\\\\cyrbyus\",\"ѫ\"],[\"\\\\CYRC\",\"Ц\"],[\"\\\\cyrc\",\"ц\"],[\"\\\\CYRCH\",\"Ч\"],[\"\\\\cyrch\",\"ч\"],[\"\\\\CYRCHLDSC\",\"Ӌ\"],[\"\\\\cyrchldsc\",\"ӌ\"],[\"\\\\CYRCHRDSC\",\"Ҷ\"],[\"\\\\cyrchrdsc\",\"ҷ\"],[\"\\\\CYRCHVCRS\",\"Ҹ\"],[\"\\\\cyrchvcrs\",\"ҹ\"],[\"\\\\CYRD\",\"Д\"],[\"\\\\cyrd\",\"д\"],[\"\\\\CYRDJE\",\"Ђ\"],[\"\\\\cyrdje\",\"ђ\"],[\"\\\\CYRDZE\",\"Ѕ\"],[\"\\\\cyrdze\",\"ѕ\"],[\"\\\\CYRDZHE\",\"Џ\"],[\"\\\\cyrdzhe\",\"џ\"],[\"\\\\CYRE\",\"Е\"],[\"\\\\cyre\",\"е\"],[\"\\\\CYREREV\",\"Э\"],[\"\\\\cyrerev\",\"э\"],[\"\\\\CYRERY\",\"Ы\"],[\"\\\\cyrery\",\"ы\"],[\"\\\\CYRF\",\"Ф\"],[\"\\\\cyrf\",\"ф\"],[\"\\\\CYRFITA\",\"Ѳ\"],[\"\\\\cyrfita\",\"ѳ\"],[\"\\\\CYRG\",\"Г\"],[\"\\\\cyrg\",\"г\"],[\"\\\\CYRGHCRS\",\"Ғ\"],[\"\\\\cyrghcrs\",\"ғ\"],[\"\\\\CYRGHK\",\"Ҕ\"],[\"\\\\cyrghk\",\"ҕ\"],[\"\\\\CYRGUP\",\"Ґ\"],[\"\\\\cyrgup\",\"ґ\"],[\"\\\\CYRH\",\"Х\"],[\"\\\\cyrh\",\"х\"],[\"\\\\CYRHDSC\",\"Ҳ\"],[\"\\\\cyrhdsc\",\"ҳ\"],[\"\\\\CYRHRDSN\",\"Ъ\"],[\"\\\\cyrhrdsn\",\"ъ\"],[\"\\\\CYRI\",\"И\"],[\"\\\\cyri\",\"и\"],[\"\\\\CYRIE\",\"Є\"],[\"\\\\cyrie\",\"є\"],[\"\\\\CYRII\",\"І\"],[\"\\\\cyrii\",\"і\"],[\"\\\\CYRISHRT\",\"Й\"],[\"\\\\cyrishrt\",\"й\"],[\"\\\\CYRIZH\",\"Ѵ\"],[\"\\\\cyrizh\",\"ѵ\"],[\"\\\\CYRJE\",\"Ј\"],[\"\\\\cyrje\",\"ј\"],[\"\\\\CYRK\",\"К\"],[\"\\\\cyrk\",\"к\"],[\"\\\\CYRKBEAK\",\"Ҡ\"],[\"\\\\cyrkbeak\",\"ҡ\"],[\"\\\\CYRKDSC\",\"Қ\"],[\"\\\\cyrkdsc\",\"қ\"],[\"\\\\CYRKHCRS\",\"Ҟ\"],[\"\\\\cyrkhcrs\",\"ҟ\"],[\"\\\\CYRKHK\",\"Ӄ\"],[\"\\\\cyrkhk\",\"ӄ\"],[\"\\\\CYRKVCRS\",\"Ҝ\"],[\"\\\\cyrkvcrs\",\"ҝ\"],[\"\\\\CYRL\",\"Л\"],[\"\\\\cyrl\",\"л\"],[\"\\\\CYRLDSC\",\"Ӆ\"],[\"\\\\cyrldsc\",\"ӆ\"],[\"\\\\CYRLJE\",\"Љ\"],[\"\\\\cyrlje\",\"љ\"],[\"\\\\CYRM\",\"М\"],[\"\\\\cyrm\",\"м\"],[\"\\\\CYRMDSC\",\"Ӎ\"],[\"\\\\cyrmdsc\",\"ӎ\"],[\"\\\\CYRN\",\"Н\"],[\"\\\\cyrn\",\"н\"],[\"\\\\CYRNDSC\",\"Ң\"],[\"\\\\cyrndsc\",\"ң\"],[\"\\\\CYRNG\",\"Ҥ\"],[\"\\\\cyrng\",\"ҥ\"],[\"\\\\CYRNHK\",\"Ӈ\"],[\"\\\\cyrnhk\",\"ӈ\"],[\"\\\\CYRNJE\",\"Њ\"],[\"\\\\cyrnje\",\"њ\"],[\"\\\\CYRO\",\"О\"],[\"\\\\cyro\",\"о\"],[\"\\\\CYROTLD\",\"Ө\"],[\"\\\\cyrotld\",\"ө\"],[\"\\\\CYRP\",\"П\"],[\"\\\\cyrp\",\"п\"],[\"\\\\CYRpalochka\",\"Ӏ\"],[\"\\\\CYRPHK\",\"Ҧ\"],[\"\\\\cyrphk\",\"ҧ\"],[\"\\\\CYRR\",\"Р\"],[\"\\\\cyrr\",\"р\"],[\"\\\\CYRRTICK\",\"Ҏ\"],[\"\\\\cyrrtick\",\"ҏ\"],[\"\\\\CYRS\",\"С\"],[\"\\\\cyrs\",\"с\"],[\"\\\\CYRSCHWA\",\"Ә\"],[\"\\\\cyrschwa\",\"ә\"],[\"\\\\CYRSDSC\",\"Ҫ\"],[\"\\\\cyrsdsc\",\"ҫ\"],[\"\\\\CYRSEMISFTSN\",\"Ҍ\"],[\"\\\\cyrsemisftsn\",\"ҍ\"],[\"\\\\CYRSFTSN\",\"Ь\"],[\"\\\\cyrsftsn\",\"ь\"],[\"\\\\CYRSH\",\"Ш\"],[\"\\\\cyrsh\",\"ш\"],[\"\\\\CYRSHCH\",\"Щ\"],[\"\\\\cyrshch\",\"щ\"],[\"\\\\CYRSHHA\",\"Һ\"],[\"\\\\cyrshha\",\"һ\"],[\"\\\\CYRT\",\"Т\"],[\"\\\\cyrt\",\"т\"],[\"\\\\CYRTDSC\",\"Ҭ\"],[\"\\\\cyrtdsc\",\"ҭ\"],[\"\\\\CYRTETSE\",\"Ҵ\"],[\"\\\\cyrtetse\",\"ҵ\"],[\"\\\\CYRTSHE\",\"Ћ\"],[\"\\\\cyrtshe\",\"ћ\"],[\"\\\\CYRU\",\"У\"],[\"\\\\cyru\",\"у\"],[\"\\\\CYRUSHRT\",\"Ў\"],[\"\\\\cyrushrt\",\"ў\"],[\"\\\\CYRV\",\"В\"],[\"\\\\cyrv\",\"в\"],[\"\\\\CYRY\",\"Ү\"],[\"\\\\cyry\",\"ү\"],[\"\\\\CYRYA\",\"Я\"],[\"\\\\cyrya\",\"я\"],[\"\\\\CYRYAT\",\"Ѣ\"],[\"\\\\cyryat\",\"ѣ\"],[\"\\\\CYRYHCRS\",\"Ұ\"],[\"\\\\cyryhcrs\",\"ұ\"],[\"\\\\CYRYI\",\"Ї\"],[\"\\\\cyryi\",\"ї\"],[\"\\\\CYRYO\",\"Ё\"],[\"\\\\cyryo\",\"ё\"],[\"\\\\CYRYU\",\"Ю\"],[\"\\\\cyryu\",\"ю\"],[\"\\\\CYRZ\",\"З\"],[\"\\\\cyrz\",\"з\"],[\"\\\\CYRZDSC\",\"Ҙ\"],[\"\\\\cyrzdsc\",\"ҙ\"],[\"\\\\CYRZH\",\"Ж\"],[\"\\\\cyrzh\",\"ж\"],[\"\\\\CYRZHDSC\",\"Җ\"],[\"\\\\cyrzhdsc\",\"җ\"],[\"\\\\DH\",\"Ð\"],[\"\\\\dh\",\"ð\"],[\"\\\\DJ\",\"Đ\"],[\"\\\\dj\",\"đ\"],[\"\\\\guillemotleft\",\"«\"],[\"\\\\guillemotright\",\"»\"],[\"\\\\guilsinglleft\",\"‹\"],[\"\\\\guilsinglright\",\"›\"],[\"\\\\H O\",\"Ő\"],[\"\\\\H o\",\"ő\"],[\"\\\\H U\",\"Ű\"],[\"\\\\H u\",\"ű\"],[\"\\\\hebalef\",\"א\"],[\"\\\\hebayin\",\"ע\"],[\"\\\\hebbet\",\"ב\"],[\"\\\\hebdalet\",\"ד\"],[\"\\\\hebfinalkaf\",\"ך\"],[\"\\\\hebfinalmem\",\"ם\"],[\"\\\\hebfinalnun\",\"ן\"],[\"\\\\hebfinalpe\",\"ף\"],[\"\\\\hebfinaltsadi\",\"ץ\"],[\"\\\\hebgimel\",\"ג\"],[\"\\\\hebhe\",\"ה\"],[\"\\\\hebhet\",\"ח\"],[\"\\\\hebkaf\",\"כ\"],[\"\\\\heblamed\",\"ל\"],[\"\\\\hebmem\",\"מ\"],[\"\\\\hebnun\",\"נ\"],[\"\\\\hebpe\",\"פ\"],[\"\\\\hebqof\",\"ק\"],[\"\\\\hebresh\",\"ר\"],[\"\\\\hebsamekh\",\"ס\"],[\"\\\\hebshin\",\"ש\"],[\"\\\\hebtav\",\"ת\"],[\"\\\\hebtet\",\"ט\"],[\"\\\\hebtsadi\",\"צ\"],[\"\\\\hebvav\",\"ו\"],[\"\\\\hebyod\",\"י\"],[\"\\\\hebzayin\",\"ז\"],[\"\\\\i\",\"ı\"],[\"\\\\IJ\",\"Ĳ\"],[\"\\\\ij\",\"ĳ\"],[\"\\\\j\",\"ȷ\"],[\"\\\\k \",\"˛\"],[\"\\\\k A\",\"Ą\"],[\"\\\\k a\",\"ą\"],[\"\\\\k E\",\"Ę\"],[\"\\\\k e\",\"ę\"],[\"\\\\k I\",\"Į\"],[\"\\\\k i\",\"į\"],[\"\\\\k U\",\"Ų\"],[\"\\\\k u\",\"ų\"],[\"\\\\L\",\"Ł\"],[\"\\\\l\",\"ł\"],[\"\\\\NG\",\"Ŋ\"],[\"\\\\ng\",\"ŋ\"],[\"\\\\nobreakspace\",\"\xA0\"],[\"\\\\O\",\"Ø\"],[\"\\\\o\",\"ø\"],[\"\\\\OE\",\"Œ\"],[\"\\\\oe\",\"œ\"],[\"\\\\quotedblbase\",\"„\"],[\"\\\\quotesinglbase\",\"‚\"],[\"\\\\r \",\"˚\"],[\"\\\\r A\",\"Å\"],[\"\\\\r a\",\"å\"],[\"\\\\r U\",\"Ů\"],[\"\\\\r u\",\"ů\"],[\"\\\\ss\",\"ß\"],[\"\\\\textacutedbl\",\"˝\"],[\"\\\\textalpha\",\"α\"],[\"\\\\textapproxequal\",\"≈\"],[\"\\\\textasciiacute\",\"´\"],[\"\\\\textasciibreve\",\"˘\"],[\"\\\\textasciicaron\",\"ˇ\"],[\"\\\\textasciicircum\",\"ˆ\"],[\"\\\\textasciidieresis\",\"¨\"],[\"\\\\textasciigrave\",\"ˋ\"],[\"\\\\textasciimacron\",\"¯\"],[\"\\\\textasciitilde\",\"˜\"],[\"\\\\textasteriskcentered\",\"⁎\"],[\"\\\\textbaht\",\"฿\"],[\"\\\\textbardbl\",\"‖\"],[\"\\\\textbeta\",\"β\"],[\"\\\\textbigcircle\",\"◯\"],[\"\\\\textblacksquare\",\"■\"],[\"\\\\textblank\",\"␢\"],[\"\\\\textblock\",\"█\"],[\"\\\\textbrokenbar\",\"¦\"],[\"\\\\textbullet\",\"•\"],[\"\\\\textbullet\",\"∙\"],[\"\\\\textcap\",\"∧\"],[\"\\\\textcelsius\",\"℃\"],[\"\\\\textcent\",\"¢\"],[\"\\\\textcircledP\",\"℗\"],[\"\\\\textcolonmonetary\",\"₡\"],[\"\\\\textcommabelow S\",\"Ș\"],[\"\\\\textcommabelow s\",\"ș\"],[\"\\\\textcommabelow T\",\"Ț\"],[\"\\\\textcommabelow t\",\"ț\"],[\"\\\\textcompwordmark\",\"‌\"],[\"\\\\textcontourintegral\",\"∮\"],[\"\\\\textcopyright\",\"©\"],[\"\\\\textcurrency\",\"¤\"],[\"\\\\textdagger\",\"†\"],[\"\\\\textdaggerdbl\",\"‡\"],[\"\\\\textdbllowline\",\"‗\"],[\"\\\\textdegree\",\"°\"],[\"\\\\textdelta\",\"δ\"],[\"\\\\textdiscount\",\"⁒\"],[\"\\\\textdiv\",\"÷\"],[\"\\\\textdkshade\",\"▓\"],[\"\\\\textdnblock\",\"▄\"],[\"\\\\textdong\",\"₫\"],[\"\\\\textdownarrow\",\"↓\"],[\"\\\\textelement\",\"∈\"],[\"\\\\textellipsis\",\"…\"],[\"\\\\textemdash\",\"—\"],[\"\\\\textendash\",\"–\"],[\"\\\\textepsilon\",\"ε\"],[\"\\\\textequivalence\",\"≡\"],[\"\\\\textestimated\",\"℮\"],[\"\\\\texteuro\",\"€\"],[\"\\\\textexclamdown\",\"¡\"],[\"\\\\textflorin\",\"ƒ\"],[\"\\\\textfractionsolidus\",\"⁄\"],[\"\\\\textGamma\",\"Γ\"],[\"\\\\textgreaterequal\",\"≥\"],[\"\\\\texthorizontalbar\",\"―\"],[\"\\\\textincrement\",\"∆\"],[\"\\\\textinfinity\",\"∞\"],[\"\\\\textintegral\",\"∫\"],[\"\\\\textinterrobang\",\"‽\"],[\"\\\\textintersection\",\"∩\"],[\"\\\\textkra\",\"ĸ\"],[\"\\\\textlangle\",\"〈\"],[\"\\\\textleftarrow\",\"←\"],[\"\\\\textlessequal\",\"≤\"],[\"\\\\textlfblock\",\"▌\"],[\"\\\\textlira\",\"₤\"],[\"\\\\textlnot\",\"¬\"],[\"\\\\textlozenge\",\"◊\"],[\"\\\\textltshade\",\"░\"],[\"\\\\textmalteseH\",\"Ħ\"],[\"\\\\textmalteseh\",\"ħ\"],[\"\\\\textmho\",\"℧\"],[\"\\\\textmu\",\"µ\"],[\"\\\\textmusicalnote\",\"♪\"],[\"\\\\textnaira\",\"₦\"],[\"\\\\textnotequal\",\"≠\"],[\"\\\\textnsuperior\",\"ⁿ\"],[\"\\\\textnumero\",\"№\"],[\"\\\\textohm\",\"Ω\"],[\"\\\\textOmega\",\"Ω\"],[\"\\\\textonehalf\",\"½\"],[\"\\\\textonequarter\",\"¼\"],[\"\\\\textonesuperior\",\"¹\"],[\"\\\\textopenbullet\",\"◦\"],[\"\\\\textordfeminine\",\"ª\"],[\"\\\\textordmasculine\",\"º\"],[\"\\\\textparagraph\",\"¶\"],[\"\\\\textpartial\",\"∂\"],[\"\\\\textperiodcentered\",\"·\"],[\"\\\\textpertenthousand\",\"‱\"],[\"\\\\textperthousand\",\"‰\"],[\"\\\\textpeseta\",\"₧\"],[\"\\\\textpeso\",\"₱\"],[\"\\\\textPhi\",\"Φ\"],[\"\\\\textphi\",\"φ\"],[\"\\\\textpi\",\"π\"],[\"\\\\textpm\",\"±\"],[\"\\\\textproduct\",\"∏\"],[\"\\\\textquestiondown\",\"¿\"],[\"\\\\textquotedblleft\",\"“\"],[\"\\\\textquotedblright\",\"”\"],[\"\\\\textquoteleft\",\"‘\"],[\"\\\\textquoteright\",\"’\"],[\"\\\\textrangle\",\"〉\"],[\"\\\\textrecipe\",\"℞\"],[\"\\\\textreferencemark\",\"※\"],[\"\\\\textregistered\",\"®\"],[\"\\\\textrevlogicalnot\",\"⌐\"],[\"\\\\textrightarrow\",\"→\"],[\"\\\\textrtblock\",\"▐\"],[\"\\\\textsection\",\"§\"],[\"\\\\textservicemark\",\"℠\"],[\"\\\\textSFi\",\"┌\"],[\"\\\\textSFii\",\"└\"],[\"\\\\textSFiii\",\"┐\"],[\"\\\\textSFiv\",\"┘\"],[\"\\\\textSFix\",\"┤\"],[\"\\\\textSFl\",\"╘\"],[\"\\\\textSFli\",\"╒\"],[\"\\\\textSFlii\",\"╓\"],[\"\\\\textSFliii\",\"╫\"],[\"\\\\textSFliv\",\"╪\"],[\"\\\\textSFv\",\"┼\"],[\"\\\\textSFvi\",\"┬\"],[\"\\\\textSFvii\",\"┴\"],[\"\\\\textSFviii\",\"├\"],[\"\\\\textSFx\",\"─\"],[\"\\\\textSFxi\",\"│\"],[\"\\\\textSFxix\",\"╡\"],[\"\\\\textSFxl\",\"╩\"],[\"\\\\textSFxli\",\"╦\"],[\"\\\\textSFxlii\",\"╠\"],[\"\\\\textSFxliii\",\"═\"],[\"\\\\textSFxliv\",\"╬\"],[\"\\\\textSFxlix\",\"╙\"],[\"\\\\textSFxlv\",\"╧\"],[\"\\\\textSFxlvi\",\"╨\"],[\"\\\\textSFxlvii\",\"╤\"],[\"\\\\textSFxlviii\",\"╥\"],[\"\\\\textSFxx\",\"╢\"],[\"\\\\textSFxxi\",\"╖\"],[\"\\\\textSFxxii\",\"╕\"],[\"\\\\textSFxxiii\",\"╣\"],[\"\\\\textSFxxiv\",\"║\"],[\"\\\\textSFxxv\",\"╗\"],[\"\\\\textSFxxvi\",\"╝\"],[\"\\\\textSFxxvii\",\"╜\"],[\"\\\\textSFxxviii\",\"╛\"],[\"\\\\textSFxxxix\",\"╔\"],[\"\\\\textSFxxxvi\",\"╞\"],[\"\\\\textSFxxxvii\",\"╟\"],[\"\\\\textSFxxxviii\",\"╚\"],[\"\\\\textshade\",\"▒\"],[\"\\\\textSigma\",\"Σ\"],[\"\\\\textsigma\",\"σ\"],[\"\\\\textsterling\",\"£\"],[\"\\\\textsummation\",\"∑\"],[\"\\\\textsurd\",\"√\"],[\"\\\\texttau\",\"τ\"],[\"\\\\textTheta\",\"Θ\"],[\"\\\\textthreequarters\",\"¾\"],[\"\\\\textthreesuperior\",\"³\"],[\"\\\\texttimes\",\"×\"],[\"\\\\texttrademark\",\"™\"],[\"\\\\textTstroke\",\"Ŧ\"],[\"\\\\texttstroke\",\"ŧ\"],[\"\\\\texttwosuperior\",\"²\"],[\"\\\\textuparrow\",\"↑\"],[\"\\\\textupblock\",\"▀\"],[\"\\\\textvisiblespace\",\"␣\"],[\"\\\\textwon\",\"₩\"],[\"\\\\textyen\",\"¥\"],[\"\\\\TH\",\"Þ\"],[\"\\\\th\",\"þ\"],[\"\\\\u A\",\"Ă\"],[\"\\\\u a\",\"ă\"],[\"\\\\u G\",\"Ğ\"],[\"\\\\u g\",\"ğ\"],[\"\\\\u U\",\"Ŭ\"],[\"\\\\u u\",\"ŭ\"],[\"\\\\v \\\\i\",\"ǐ\"],[\"\\\\v \\\\j\",\"ǰ\"],[\"\\\\v A\",\"Ǎ\"],[\"\\\\v a\",\"ǎ\"],[\"\\\\v C\",\"Č\"],[\"\\\\v c\",\"č\"],[\"\\\\v D\",\"Ď\"],[\"\\\\v d\",\"ď\"],[\"\\\\v E\",\"Ě\"],[\"\\\\v e\",\"ě\"],[\"\\\\v G\",\"Ǧ\"],[\"\\\\v g\",\"ǧ\"],[\"\\\\v I\",\"Ǐ\"],[\"\\\\v K\",\"Ǩ\"],[\"\\\\v k\",\"ǩ\"],[\"\\\\v L\",\"Ľ\"],[\"\\\\v l\",\"ľ\"],[\"\\\\v N\",\"Ň\"],[\"\\\\v n\",\"ň\"],[\"\\\\v O\",\"Ǒ\"],[\"\\\\v o\",\"ǒ\"],[\"\\\\v R\",\"Ř\"],[\"\\\\v r\",\"ř\"],[\"\\\\v S\",\"Š\"],[\"\\\\v s\",\"š\"],[\"\\\\v T\",\"Ť\"],[\"\\\\v t\",\"ť\"],[\"\\\\v U\",\"Ǔ\"],[\"\\\\v u\",\"ǔ\"],[\"\\\\v Z\",\"Ž\"],[\"\\\\v z\",\"ž\"],[\"\\\\´ i\",\"í\"],[\"\\\\´ A\",\"Á\"],[\"\\\\´ a\",\"á\"],[\"\\\\´ C\",\"Ć\"],[\"\\\\´ c\",\"ć\"],[\"\\\\´ E\",\"É\"],[\"\\\\´ e\",\"é\"],[\"\\\\´ G\",\"Ǵ\"],[\"\\\\´ g\",\"ǵ\"],[\"\\\\´ I\",\"Í\"],[\"\\\\´ K\",\"Ḱ\"],[\"\\\\´ k\",\"ḱ\"],[\"\\\\´ L\",\"Ĺ\"],[\"\\\\´ l\",\"ĺ\"],[\"\\\\´ M\",\"Ḿ\"],[\"\\\\´ m\",\"ḿ\"],[\"\\\\´ N\",\"Ń\"],[\"\\\\´ n\",\"ń\"],[\"\\\\´ O\",\"Ó\"],[\"\\\\´ o\",\"ó\"],[\"\\\\´ P\",\"Ṕ\"],[\"\\\\´ p\",\"ṕ\"],[\"\\\\´ R\",\"Ŕ\"],[\"\\\\´ r\",\"ŕ\"],[\"\\\\´ S\",\"Ś\"],[\"\\\\´ s\",\"ś\"],[\"\\\\´ U\",\"Ú\"],[\"\\\\´ u\",\"ú\"],[\"\\\\´ W\",\"Ẃ\"],[\"\\\\´ w\",\"ẃ\"],[\"\\\\´ Y\",\"Ý\"],[\"\\\\´ y\",\"ý\"],[\"\\\\´ Z\",\"Ź\"],[\"\\\\´ z\",\"ź\"],[\"\\\\` i\",\"ì\"],[\"\\\\` A\",\"Á\"],[\"\\\\` a\",\"à\"],[\"\\\\` E\",\"È\"],[\"\\\\` e\",\"è\"],[\"\\\\` I\",\"Ì\"],[\"\\\\` N\",\"Ǹ\"],[\"\\\\` n\",\"ǹ\"],[\"\\\\` O\",\"Ò\"],[\"\\\\` o\",\"ò\"],[\"\\\\` U\",\"Ù\"],[\"\\\\` u\",\"ù\"],[\"\\\\` W\",\"Ẁ\"],[\"\\\\` w\",\"ẁ\"],[\"\\\\` Y\",\"Ỳ\"],[\"\\\\` y\",\"ỳ\"]]");
//#endregion
//#region libs/ligature-lookup.ts
function makeString(content) {
	return {
		type: "string",
		content
	};
}
var mappedLigatures = ligature_macros_default.map(([macro, str]) => [macro, makeString(str)]);
var SUBSTITUTION_MAP = new Map([
	["\\,", makeString(" ")],
	["\\thinspace", makeString(" ")],
	["\\:", makeString(" ")],
	["\\>", makeString(" ")],
	["\\medspace", makeString(" ")],
	["\\;", makeString(" ")],
	["\\thickspace", makeString(" ")],
	["\\enspace", makeString(" ")],
	["\\quad", makeString(" ")],
	["\\qquad", makeString("  ")],
	["\\@", makeString("")],
	["\\/", makeString("")],
	["~", makeString("\xA0")],
	["- - -", makeString("—")],
	["- -", makeString("–")],
	["` `", makeString("“")],
	["\"", makeString("”")],
	["' '", makeString("”")],
	["`", makeString("‘")],
	["'", makeString("’")],
	["< <", makeString("«")],
	["> >", makeString("»")],
	["\\$", makeString("$")],
	["\\%", makeString("%")],
	["\\_", makeString("_")],
	["\\&", makeString("&")],
	["\\#", makeString("#")],
	["\\{", makeString("{")],
	["\\}", makeString("}")],
	["\\P", makeString("¶")],
	["\\S", makeString("§")],
	["\\dots", makeString("…")],
	["\\ldots", makeString("…")],
	["\\pounds", makeString("£")],
	["\\copyright", makeString("©")],
	...mappedLigatures
]);
/**
* Hash a sequence of nodes for quick lookup. This function assumes
* that a space character does not appear in the content of any of the nodes.
*/
function hashNodes(nodes) {
	return nodes.map((node) => _unified_latex_unified_latex_util_match.match.macro(node) ? `\\${node.content}` : node.content).join(" ");
}
function isMacroOrStringArray(nodes) {
	return nodes.some((node) => _unified_latex_unified_latex_util_match.match.macro(node) || _unified_latex_unified_latex_util_match.match.string(node));
}
/**
* Map a sequence of nodes to its corresponding unicode ligature. E.g.,
* `---` will be converted to `–` (an em-dash).
*
* This function assumes that `nodes` is a pure token stream with all whitespace
* removed and an surrogate letters popped from their groups. (e.g. `\: o` and `\:{o}`
* should be normalized to `["\:", "o"]` before calling this function.)
*/
function ligatureToUnicode(nodes) {
	if (!isMacroOrStringArray(nodes)) return null;
	if (nodes.length === 1 && _unified_latex_unified_latex_util_match.match.macro(nodes[0], " ") && nodes[0].escapeToken == null) return makeString(" ");
	return SUBSTITUTION_MAP.get(hashNodes(nodes)) || null;
}
//#endregion
//#region libs/parse.ts
function createMatchers() {
	return {
		isMacro: _unified_latex_unified_latex_util_match.match.anyMacro,
		isWhitespace: _unified_latex_unified_latex_util_match.match.whitespace,
		isRecognized: (nodes, whitespaceAllowed = false) => {
			const nodesToTest = [...nodes];
			if (nodes.length === 2 && _unified_latex_unified_latex_util_match.match.macro(nodes[0])) {
				const arg = nodes[1];
				if (_unified_latex_unified_latex_util_match.match.group(arg) && arg.content.length === 1) nodesToTest[1] = arg.content[0];
				if (nodes[0].content.length === 1 && nodesToTest[1].type === "whitespace") nodesToTest.length = 1;
			}
			return ligatureToUnicode(nodesToTest);
		},
		isSplitable: (node) => _unified_latex_unified_latex_util_match.match.anyString(node) && node.content.length > 1,
		split: (node) => [{
			type: "string",
			content: node.content.charAt(0)
		}, {
			type: "string",
			content: node.content.slice(1)
		}]
	};
}
/**
* Parse for recognized ligatures like `---` and `\:o`, etc. These are
* replaced with string nodes with the appropriate unicode character subbed in.
*/
function parseLigatures(ast) {
	if (!Array.isArray(ast)) throw new Error("You must pass an array of nodes");
	ast = (0, _unified_latex_unified_latex_util_pegjs.decorateArrayForPegjs)([...ast]);
	return _unified_latex_unified_latex_util_pegjs.LigaturesPegParser.parse(ast, createMatchers());
}
//#endregion
//#region libs/expand-unicode-ligatures.ts
/**
* Turn all ligatures into their unicode equivalent. For example,
* `---` -> an em-dash and `\^o` to `ô`. This only applies in non-math mode,
* since programs like katex will process math ligatures.
*/
function expandUnicodeLigatures(tree) {
	(0, _unified_latex_unified_latex_util_visit.visit)(tree, (nodes, info) => {
		if (info.context.inMathMode || info.context.hasMathModeAncestor) return;
		const parsed = parseLigatures(nodes);
		nodes.length = 0;
		nodes.push(...parsed);
	}, {
		includeArrays: true,
		test: Array.isArray
	});
}
//#endregion
//#region index.ts
/**
* ## What is this?
*
* Functions to find and replace ligatures in a `unified-latex` Abstract Syntax Tree (AST) with their Unicode equivalents.
*
* ## When should I use this?
*
* If you are converting LaTeX to plain text or HTML.
*/
//#endregion
exports.createMatchers = createMatchers;
exports.expandUnicodeLigatures = expandUnicodeLigatures;
exports.parseLigatures = parseLigatures;

//# sourceMappingURL=index.cjs.map