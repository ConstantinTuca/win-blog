module.exports = app => {
	'use strict';
	let Handlebars = require('handlebars');
	let Swag = require('swag');
	let crypto = require('crypto');

	let Dates = {};

	Dates.padNumber = function (num, count, padCharacter) {
		var lenDiff, padding;
		if (typeof padCharacter === 'undefined') {
			padCharacter = '0';
		}
		lenDiff = count - String(num).length;
		padding = '';
		if (lenDiff > 0) {
			while (lenDiff--) {
				padding += padCharacter;
			}
		}
		return padding + num;
	};

	Dates.format = function (date, format) {
		return format.replace(Dates.formats, function (m, p) {
			switch (p) {
				case 'b':
					return Dates.abbreviatedMonths[date.getMonth()];
				case 'B':
					return Dates.fullMonths[date.getMonth()];
				case 'd':
					return Dates.padNumber(date.getDate(), 2);
				case 'e':
					return Dates.padNumber(date.getDate(), 2, ' ');
				case 'h':
					return Dates.format(date, '%b');
				case 'H':
					return Dates.padNumber(date.getHours(), 2);
				case 'm':
					return Dates.padNumber(date.getMonth() + 1, 2);
				case 'M':
					return Dates.padNumber(date.getMinutes(), 2);
				case 'y':
					return String(date.getFullYear()).substring(2);
				case 'Y':
					return date.getFullYear();
				default:
					return match;
			}
		});
	};

	Dates.formats = /%(a|A|b|B|c|C|d|D|e|F|h|H|I|j|k|l|L|m|M|n|p|P|r|R|s|S|t|T|u|U|v|V|W|w|x|X|y|Y|z)/g;

	Dates.abbreviatedMonths = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Noi', 'Dec'];

	Dates.fullMonths = ['Ianuarie', 'Februarie', 'Martie', 'April', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noviembrie', 'Decembrie'];

	Number.prototype.format = function (n, x, s, c) {
		let re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
			num = this.toFixed(Math.max(0, ~~n));
		return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
	};

	Handlebars.registerHelper('currencyLei', function (amount) {
		let num = Number(amount);
		return num ? num.format(2, 3, '.', ',') : null;
	});
	Handlebars.registerHelper('formatDate', (date, format) => {
		if (date) {
			date = new Date(date);
			return Dates.format(date, format);
		}
		return null;
	});

	Handlebars.registerHelper('nextYear', function (year) {
		return Number(year) + 1;
	});

	Handlebars.registerHelper('monthDate', function (dt) {
		if (dt) {
			let month = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'];
			let d = new Date(dt);
			return month[d.getMonth()];
		}
		return null;
	});

	Handlebars.registerHelper('notEqual', function (lvalue, rvalue, options) {
		return lvalue === rvalue ? options.inverse(this) : options.fn(this);
	});

	Handlebars.registerHelper('compare', function (lval, op, rval, options) {
		switch (op) {
			case '!=':
				return lval != rval ? options.fn(this) : options.inverse(this);
			case '==':
				return lval == rval ? options.fn(this) : options.inverse(this);
			case '===':
				return lval === rval ? options.fn(this) : options.inverse(this);
			case '<':
				return lval < rval ? options.fn(this) : options.inverse(this);
			case '<=':
				return lval <= rval ? options.fn(this) : options.inverse(this);
			case '>':
				return lval > rval ? options.fn(this) : options.inverse(this);
			case '>=':
				return lval >= rval ? options.fn(this) : options.inverse(this);
		}
	});

	Handlebars.registerHelper('math', function (lvalue, operator, rvalue) {
		lvalue = parseFloat(lvalue);
		rvalue = parseFloat(rvalue);

		return {
			"+": lvalue + rvalue,
			"-": lvalue - rvalue,
			"*": lvalue * rvalue,
			"/": lvalue / rvalue,
			"%": lvalue % rvalue
		}[operator];
	});

	Handlebars.registerHelper('uppercase', function (str) {
		return str ? str.toUpperCase() : '';
	});

	Handlebars.registerHelper('calculate', function (val1, op, val2) {
		let num = Number(val1);
		let num2 = Number(val2);
		let amount = null;

		if (num && num2) {
			switch (op) {
				case '+':
					amount = num2 ? (num + num2) : num;
					break;
				case '-':
					amount = num2 ? (num - num2) : num;
					break;
			}
		} else if (num && !num2) {
			amount = num;
		} else if (!num && num2) {
			amount = num2;
		}
		return amount ? amount.format(0, 3, '.') : null;
	});

	Handlebars.registerHelper('replace', function (text, append) {
		let tab = new RegExp('\t', 'g'),
			br = new RegExp('\n', 'g');
		if (text && text.length > 0) {
			let indexTab = text.indexOf('\t'),
				indexBr = text.indexOf('\n');
			text = text.replace(br, '</p><p class="nopadding-top-bottom">') + '</p>';

			if (indexBr < 0 && indexTab < 0) {
				text = '<p class="nopadding-top-bottom">' + text + '</p>';
			} else if (indexBr < indexTab || indexTab < 0) {
				text = '<p class="nopadding-top-bottom">' + text;
			}

			text = text.replace(tab, '</p><p class="indent nopadding-top-bottom">');
		}

		return text;
	});

	Handlebars.registerHelper('isEven', function (val, options) {
		return val > 0 && val % 2 === 0 ? options.fn(this) : options.inverse(this);
	});

	Handlebars.registerHelper('getChar', function (str, index) {
		if (typeof str !== "undefined") {
			let newStr = str
			let i = parseInt(index)
			return newStr.charAt(i)
		}
	});

	Handlebars.registerHelper('sliceStr', function (str, v1, v2) {
		if (typeof str !== "undefined") {
			let newStr = str
			let vs1 = parseInt(v1)
			let vs2 = parseInt(v2)
			return newStr.slice(vs1, vs2)
		}
	});

	Handlebars.registerHelper('for', function (from, to, incr, block) {
		var accum = '';
		for (var i = from; i < to; i += incr)
			accum += block.fn(i);
		return accum;
	});

	Handlebars.registerHelper('combineClassStudy', function (className, situation) {
		return className + ' - la ' + situation;
	});

	Handlebars.registerHelper('dateMonthYear', d => {
		if (d) {
			d = new Date(d);
			return d.toLocaleDateString('en-GB');
		}
		return null;
	});

	Handlebars.registerHelper("inc", function (value) {
		return parseInt(value) + 1;
	});

	Handlebars.registerHelper("float", function (value) {
		let n = parseFloat(value).toFixed(2)
		return n.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
	});

	Handlebars.registerHelper("numberEq", function (value, number) {
		if (Number(value) === Number(number)) {
			return true;
		} else {
			return false;
		}
	});
	Handlebars.registerHelper("notEmptyString", function (value) {
		if (value != '') {
			return true;
		} else {
			return false;
		}
	});

	Handlebars.registerHelper('eachData', function (arr, ind) {
		var val = '';
		if (arr[ind]) {
			val = arr[ind];
		} else {
			val = '';
		}
		return val;
	});

	Handlebars.registerHelper('is_today', function (year, month, day) {
		let today = new Date(new Date().setHours(3, 0, 0, 0)).getTime();
		let date = new Date(new Date(year, month, day).setHours(3, 0, 0, 0)).getTime();
		if(date <= today){
			return true;
		} else {
			return false;
		}
	});

	Swag.registerHelpers(Handlebars);

	let format = {
		portrait: {
			tempDir: './tempReports',
			tplBaseDir: './server/reports',
			pageSize: 'A4',
			orientation: 'portrait',
			pageMargin: '1cm'
		},
		landscape: {
			tempDir: './tempReports',
			tplBaseDir: './server/reports',
			pageSize: 'A4',
			orientation: 'landscape',
			pageMargin: '1cm'
		},
		landscape_margin_0: {
			tempDir: './tempReports',
			tplBaseDir: './server/reports',
			pageSize: 'A4',
			orientation: 'landscape',
			pageMargin: '0cm'
		}
	};

	let capture = function (opts, callback) {
		if (!!app.locals.ph) {
			return app.locals.ph.createPage().then(function (page) {
				let footerCallback;
				if (opts.pageNumberOffset) {
					footerCallback = opts.footerContent ? 'function(pageNum, numPages) { var tmp = \'' + opts.footerContent.replace(/(\r\n|\n|\r)/gm, "") + '\'; return tmp.replace("#pageNum#", pageNum + ' + opts.pageNumberOffset + '); }' : null;
				} else {
					footerCallback = opts.footerContent ? 'function(pageNum, numPages) { var tmp = \'' + opts.footerContent.replace(/(\r\n|\n|\r)/gm, "") + '\'; return tmp.replace("#pageNum#", pageNum); }' : null;
				}
				Promise.all([page.property('paperSize', {
					format: opts.formatPage.pageSize,
					orientation: opts.formatPage.orientation,
					margin: opts.formatPage.pageMargin,
					footer: opts.disableFooter ? null : {
						height: opts.footerHeight ? opts.footerHeight : '1cm',
						contents: app.locals.ph.callback(footerCallback ? footerCallback : function (pageNum, numPages) {
							const date = new Date();
							const now = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
							return '<h6  style="text-align: center; font-size: 8px; font-weight: normal;">Pagina' + pageNum + ' / ' + numPages + '</h6>' +
								'<h6  style="text-align: right; font-size: 8px; font-weight: normal;">Întocmit la data de: ' + now + '</h6>';
						})
					}
				}), page.property('viewportSize', {
					width: opts.formatPage.width,
					height: opts.formatPage.height
				}), page.setContent(opts.html, 'content')]).then(() => {
					let filePath = opts.formatPage.tempDir + '/' + crypto.randomBytes(12).toString('hex') + '.pdf';
					return page.render(filePath).then(function (err) {
						page.close();
						page = null;
						callback(err, filePath, opts.html);
					});
				});
			});
		} else {
			const phantom = require('phantom');
			phantom.create([], {
				dnodeOpts: { weak: false },
				parameters: { 'web-security': 'no' }
			}).then(resp => {
				app.locals.ph = resp;
				capture(opts, callback);
			});
		}
	};

	return {
		renderer: function (opts, callback) {
			if (!opts.renderHtml && (!opts.template || (opts.template && !opts.template.content))) {
				return callback('No template provided in option object');
			}
			let formatPage = format[opts.template.orientation ? opts.template.orientation : 'portrait'];
			if (opts.template.pageSize) {
				formatPage.pageSize = opts.template.pageSize;
			}
			return capture({
				html: opts.renderHtml ? opts.html : Handlebars.compile(opts.template.content)(opts.data),
				name: opts.name,
				headerHtml: opts.headerTemplate ? Handlebars.compile(opts.headerTemplate)(opts.data) : null,
				disableFooter: opts.template.disable_footer ? opts.template.disable_footer : false,
				formatPage: formatPage,
				footerContent: opts.footerContent,
				pageNumberOffset: opts.pageNumberOffset,
				footerHeight: opts.footerHeight
			}, callback);
		}
	};
};
