/*jslint 
browser: true,
nomen: false,
debug: true,
forin: true,
undef: true,
white: false,
onevar: false 
 */
var sc, DOMParser;
 
sc.helpers.createXMLFromString = function (string) {
	var xmlParser, xmlDocument;
	try {
		xmlParser = new DOMParser();
		xmlDocument = xmlParser.parseFromString(string, 'text/xml');
		return xmlDocument;
	} catch (e) {
		sc.helpers.dump(e.name + ":" + e.message);
		return null;
	}
};


