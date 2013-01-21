define([
  'models/Contact',
  'collections/ContactList'
],
function (Contact, ContactList) {

  'use strict';

  describe('Contact', function () {

    var contact, contact_list;

    beforeEach(function () {
      contact_list = new ContactList();
      contact = contact_list.create();
    });

    describe('#initialize', function () {
      it('should throw an error if constructor called directly', function () {
        expect(function () { new Contact(); }).toThrow();
      });
    });

    describe('#validate', function () {
      it('should require name', function () {
        contact.set('name', '', {validate: true});
        var errors = contact.validationError;
        expect(errors).toBeDefined();
        expect(errors.name).toBe('Name is required');
      });

      it('should check email format', function () {
        contact.set('email', 'abc', {validate: true});
        var errors = contact.validationError;
        expect(errors).toBeDefined();
        expect(errors.email).toBe('Invalid address');
      });
    });

    describe('#index', function () {
      it('should return the capitalized first character', function () {
        contact.set('name', 'abc');
        expect(contact.index()).toBe('A');
      });

      it('should return the first character for non-ascii name', function () {
        contact.set('name', 'あいう');
        expect(contact.index()).toBe('あ');
      });

      it('should return an empty character by default', function () {
        expect(contact.index()).toBe('');
      });
    });

    describe('#updateHash', function () {
      it("should be set as a change:email event handler", function () {
        spyOn(Contact.prototype, 'updateHash');
        contact = contact_list.create();
        contact.set('email', 'whoami@sample.com');
        expect(contact.updateHash).toHaveBeenCalled();
      });

      it('should update a hash attr when an email attr is changed', function () {
        var prev = contact.get('hash');
        contact.set('email', 'whoami@sample.com');
        expect(contact.get('hash')).not.toEqual(prev);
      });
    });
  });
});