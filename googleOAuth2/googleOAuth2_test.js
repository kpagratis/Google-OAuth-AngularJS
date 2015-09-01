/**
 * Created by kpagratis on 6/16/15.
 */
describe("Google OAuth2 Service", function(){
    var service;

    beforeEach(module('googleOAuth2'));

    beforeEach(inject(function(googleOAuth2Svc){
        service = googleOAuth2Svc;
    }));

    it('should be created', function(){
        expect(service).toBeDefined();
    });

    it('should start out with isBackendReady equal false', function(){
        expect(service.isBackendReady()).toBeFalsy();
    });

    it('should start out with isSignedIn equal false', function(){
        expect(service.isSignedIn()).toBeFalsy();
    });
});