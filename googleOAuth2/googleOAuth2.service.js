/**
 * Created by kpagratis on 6/13/15.
 */
(function () {
    'use strict';
    angular.module('googleOAuth2')
        .factory('googleOAuth2Svc', ['$q', googleOAuth2Svc]);

    function googleOAuth2Svc($q) {
        var vm = this;
        vm.backendReady = false;
        vm.signedIn = false;
        vm.clientId = '';
        vm.scopes = '';

        return {
            /**
             * Client id of your application
             * @param c
             */
            setClientId: function (c) {
                vm.clientId = c;
            },
            /**
             * Scopes your application is using
             * @param s (string or array)
             */
            setScopes: function (s) {
                vm.scopes = s;
            },
            /**
             * True if OAuth2 api has been loaded
             * @returns {boolean}
             */
            isBackendReady: function () {
                return vm.backendReady
            },
            /**
             * True if signed in with google
             * @returns {boolean}
             */
            isSignedIn: function () {
                return vm.signedIn
            },
            /**
             * Sign in using interactive mode
             * @returns {promise}
             */
            signIn: function () {
                return signIn(false);
            },
            /**
             * Sign in using immediate mode.  Typically used when the application first loads
             * @returns {promise}
             */
            signInImmediate: function () {
                return signIn(true);
            },
            /**
             * Sign out
             * @returns {*}
             */
            signOut: function () {
                return signOut();
            },
            /**
             * Initialize OAuth2
             */
            initOAuth2: initOAuth2
        };

        /**
         * This function loads the oauth2 api.  This is wrapped in a promise to correctly
         * reject when there's an error.  OOTB functionality resolves the promise with a
         * response.  This is clunky
         * @returns Promise
         */
        function initOAuth2() {
            var defered = $q.defer();
            gapi.client.load('oauth2', 'v2', undefined).then(function (resp) {
                vm.backendReady = (!resp);
                if (!vm.backendReady) {
                    console.debug('oauth2 not loaded');
                    defered.reject(resp);
                }
                else {
                    console.debug('oauth2 loaded');
                    defered.resolve();
                }
            });
            return defered.promise;
        }

        /**
         * gapi.auth.authorize call wrapped in a promise in order to correctly resolve/reject based
         * on the success of the authorize call.
         * @param mode true: immediate (no user interaction.  false: user interaction
         * @returns promise
         */
        function signIn(mode) {
            var defered = $q.defer();
            gapi.auth.authorize({client_id: vm.clientId, scope: vm.scopes, immediate: mode}, function (token) {
                if (token.error) {
                    defered.reject(token);
                }
                else {
                    vm.signedIn = true;
                    defered.resolve(token);
                }
            });
            return defered.promise;
        }

        /**
         * Sign out.  Sets the token to null
         * @returns {*}
         */
        function signOut() {
            var defered = $q.defer();
            gapi.auth.setToken(null);
            defered.resolve();
            return defered.promise.then(function () {
                vm.signedIn = false;
            });
        }
    }
}());