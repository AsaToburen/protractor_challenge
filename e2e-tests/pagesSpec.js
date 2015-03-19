process.env.NODE_ENV = process.env.NODE_ENV || 'TEST';
var db = require('../api/db.js');

describe("Test Pages", function() {

  beforeEach(function() {
    db.serialize(function() {
      db.run('DELETE FROM urls');
    });
  });

  var ROOT = "http://localhost:7777/#";

  function createUrlEntry(title, url) {

   // browser.debugger();

    browser.get(ROOT + "/new");
    element(by.model('formCtrl.form.title')).sendKeys(title);
    element(by.model('formCtrl.form.url')).sendKeys(url);
    return element(by.css('input[type=submit]')).click();
  }

  xit('should have no listings on the index page and show a special message', function() {
    browser.get(ROOT + "/");
    expect(element.all(by.css('.url-listing')).count()).toBe(0);

    expect(element.all(by.css('.empty-url-listing')).count()).toBe(1);
    expect(element(by.css('.empty-url-listing')).getText()).toMatch(/no URL listings/);
  });

  xit('should create a new URL listing', function() {
    var customTitle = 'title-' + Math.random();
    var customUrl = 'http://my-new-website.com/' + Math.random();

    createUrlEntry(customTitle, customUrl).then(function() {
      browser.getLocationAbsUrl().then(function(url) {
        expect(url).toMatch(/#\/urls/);
        expect(element.all(by.css('.url-listing')).count()).toBe(1);

        expect(element(by.css('.url-listing .listing-title')).getText()).toContain(customTitle);
        expect(element(by.css('.url-listing .listing-url')).getText()).toContain(customUrl);

        expect(element.all(by.css('.empty-url-listing')).count()).toBe(0);
      });
    });
  });

  xit('should remove the listing when delete is clicked', function(){
      createUrlEntry("url one", "http://url-one.com");
      
      browser.get(ROOT + "/");
      expect(element.all(by.css('.url-listing')).count()).toBe(1);

      element(by.css('.btn-danger')).click().then(function(){
      expect(element.all(by.css('.url-listing')).count()).toBe(0);

        
      });
     // btn btn-primary     '/edit/7'
  });

  it('should route to the edit view when edit is clicked', function(){
      createUrlEntry("url one", "http://url-one.com");
      
      expect(element.all(by.css('.url-listing')).count()).toBe(1);
      expect(element(by.css('.btn-primary')).getAttribute('href')).toContain('/edit/');
      element(by.css('.btn-primary')).click();
      expect(element(by.model('formCtrl.form.title')).getAttribute('value')).toContain('url one');
      expect(element(by.model('formCtrl.form.url')).getAttribute('ng-disabled')).toContain('formCtrl.edit');
      
    });


  xit('should search based off of the URL', function() {
    createUrlEntry("url one", "http://url-one.com");
    createUrlEntry("url two", "http://url-two.com");
    createUrlEntry("url three", "http://url-three.com");

    browser.get(ROOT + "/");
    expect(element.all(by.css('.url-listing')).count()).toBe(3);

    browser.get(ROOT + "/?q=one");
    expect(element.all(by.css('.url-listing')).count()).toBe(1);

    browser.get(ROOT + "/?q=x");
    expect(element.all(by.css('.url-listing')).count()).toBe(0);
  });
});