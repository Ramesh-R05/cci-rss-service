var markdownHelper = require('../.././helpers/markdownHelper');

describe('markdownHelper', function () {

    describe('renderParagraph', function () {

        var input;
        var expectedOutput;

        describe('when: content set', function () {

            before(function () {
                input = '**Hello World**'
                expectedOutput = "<p><strong>Hello World</strong></p>\n";
            });

            it('should return a paragraph containing html markup', function () {
                var actual = markdownHelper.renderParagraph(input);
                expect(actual).to.equal(expectedOutput);
            });

        });

        describe('when: content not set', function () {

            before(function () {
                input = null;
            });

            it('should return an empty string', function () {
                var actual = markdownHelper.renderParagraph(input);
                expect(actual).to.be.empty;
            });

        });

    });

    describe('renderImage', function () {

        var input = {
            url: 'http://www.example.com/test.jpg',
            caption: ''
        };

        describe('when: content set', function () {

            var expectedImageHtml;

            before(function () {
                expectedImageHtml = '<img src="' + input.url + '" alt="' + input.caption + '" />';
            });

            it('should return html containing an image', function () {
                var actual = markdownHelper.renderImage(input);
                expect(actual).to.have.string(expectedImageHtml);
            });

            describe('and when: image attributes are set', function () {

                var attributes = {
                    width: 800,
                    height: 600
                };

                before(function () {
                    expectedImageHtml = '<img src="' + input.url + '?width=' + attributes.width + '&height=' + attributes.height + '" alt="' + input.caption + '" />';
                });

                it('should append attributes as query string parameters to the image url', function () {
                    var actual = markdownHelper.renderImage(input, attributes);
                    expect(actual).to.have.string(expectedImageHtml);
                });

            });

            describe('and when: image caption is set', function () {

                var expectedCaptionHtml;

                before(function () {
                    input.caption = '**Some caption**';
                    expectedImageHtml = '<img src="' + input.url + '" alt="Some caption" />';
                    expectedCaptionHtml = '<p><strong>Some caption</strong></p>';
                });

                it('should return html with a paragraph containing the formatted caption text', function () {
                    var actual = markdownHelper.renderImage(input);
                    expect(actual).to.have.string(expectedImageHtml);
                    expect(actual).to.have.string(expectedCaptionHtml);
                });

            });

        });

        describe('when: content not set', function () {

            var originalVal;

            before(function () {
                originalVal = input.url;
                input.url = '';
            });

            after(function () {
                input.url = originalVal;
            });

            it('should return an empty string', function () {
                var actual = markdownHelper.renderImage(input);
                expect(actual).to.be.empty;
            });
        })

    });

});