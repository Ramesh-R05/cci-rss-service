var dataHandlers = require('../../../app/helpers/dataHandlers');

describe('dataHandlers', function () {

    describe('onSponsoredDataReceived', function () {

        var campaignFieldName = 'contentCampaign_t';
        var testData = [
            {
                key: 'channel',
                data: []
            },
            {
                key: 'items',
                data: [
                    {
                        contentCampaign_t: '[{ "campaignType": "Native", "sponsor": "Kellogs" }]'
                    }
                ]
            }
        ];

        describe('when: item campaign does not contain a sponsor', function () {

            before(function () {
                testData[1].data.push({ contentCampaign_t: '[{ "campaignType": "Native" }]' });
            });

            it('should ignore the item', function () {
                var actual = dataHandlers.onSponsoredDataReceived(campaignFieldName, testData);
                expect(actual[1].data.length).to.equal(1);
            });

        });

        describe('when: item campaign does not contain a campaign type', function () {

            before(function () {
                testData[1].data.push({ contentCampaign_t: '[{ "sponsor": "Kellogs" }]' });
            });

            it('should ignore the item', function () {
                var actual = dataHandlers.onSponsoredDataReceived(campaignFieldName, testData);
                expect(actual[1].data.length).to.equal(1);
            });

        });

        describe('when: item does not contain campaign data', function () {

            before(function () {
                testData[1].data.push({ contentCampaign_t: '' });
            });

            it('should ignore the item', function () {
                var actual = dataHandlers.onSponsoredDataReceived(campaignFieldName, testData);
                expect(actual[1].data.length).to.equal(1);
            });

        });

    });

    describe('onSectionsDataReceived', function () {

        var pathFieldName = 'path_ss';
        var sectionNameFields = ['contentTitle_t', 'nodeName_t'];
        var testInput = [
            {
                key: 'items',
                data: [
                    {
                        path_ss: [ "AWW--1", "AWW-1143", "AWW-1487", "AWW-1638", "AWW-9744", "AWW-19988", "AWW-20051" ]
                    },
                    {
                        path_ss: [ "AWW--1", "AWW-1143", "AWW-1628", "AWW-1630", "AWW-9748", "AWW-19986", "AWW-20050" ]
                    },
                    {
                        path_ss: [ "AWW--1", "AWW-1143", "AWW-1628", "AWW-1630", "AWW-9748", "AWW-19986", "AWW-20048" ]
                    }
                ]
            },
            {
                key: 'sections',
                data: [
                    {
                        id: 'AWW-1487',
                        contentTitle_t: 'Royals'
                    },
                    {
                        id: 'AWW-1638',
                        contentTitle_t: '',
                        nodeName_t: 'British Royal Family'
                    },
                    {
                        id: 'AWW-1628',
                        nodeName_t: 'Latest News'
                    },
                    {
                        id: 'AWW-1630',
                        contentTitle_t: 'News stories'
                    }
                ]
            }
        ];

        describe('when: data received', function () {

            it('should add an array of section names to each item data', function () {
                var actual = dataHandlers.onSectionsDataReceived(pathFieldName, sectionNameFields, testInput);
                expect(actual[0].data[0].__sections).to.exist.and.not.be.empty;
                expect(actual[0].data[0].__sections.join(',')).to.equal('Royals,British Royal Family');
                expect(actual[0].data[1].__sections).to.exist.and.not.be.empty;
                expect(actual[0].data[1].__sections.join(',')).to.equal('Latest News,News stories');
                expect(actual[0].data[2].__sections).to.exist.and.not.be.empty;
                expect(actual[0].data[2].__sections.join(',')).to.equal('Latest News,News stories');
            });

            describe('and when: no sections data exists', function () {

                var input;

                before(function () {
                    input = [
                        {
                            key: 'items',
                            data: [
                                {
                                    path_ss: ["AWW--1", "AWW-1143", "AWW-1487", "AWW-1638", "AWW-9744", "AWW-19988", "AWW-20051"]
                                },
                                {
                                    path_ss: ["AWW--1", "AWW-1143", "AWW-1628", "AWW-1630", "AWW-9748", "AWW-19986", "AWW-20050"]
                                }
                            ]
                        }
                    ];
                });

                it('should not modify the item data', function () {
                    var actual = dataHandlers.onSectionsDataReceived(pathFieldName, sectionNameFields, input);
                    expect(actual[0].data[0].__sections).to.not.exist;
                    expect(actual[0].data[1].__sections).to.not.exist;
                });

            });

            describe('and when: item sections are not found', function () {

                before(function () {
                    input = [
                        {
                            key: 'items',
                            data: [
                                {
                                    path_ss: ["AWW--1", "AWW-1143", "AWW-1487", "AWW-1638", "AWW-9744", "AWW-19988", "AWW-20051"]
                                },
                                {
                                    path_ss: ["AWW--1", "AWW-1143", "AWW-7500", "AWW-7502", "AWW-12789", "AWW-20025", "AWW-9289"]
                                }
                            ]
                        },
                        testInput[1]
                    ];
                });

                it('should set an empty section name list for that item', function () {
                    var actual = dataHandlers.onSectionsDataReceived(pathFieldName, sectionNameFields, input);
                    expect(actual[0].data[0].__sections).to.exist.and.not.be.empty;
                    expect(actual[0].data[0].__sections.join(',')).to.equal('Royals,British Royal Family');
                    expect(actual[0].data[1].__sections).to.exist.and.be.empty;
                });
            });

        });

    });

});