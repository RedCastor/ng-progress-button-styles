(function(angular) {
    "use strict";
    function whichTransitionEnd(element) {
        var transitions = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd otransitionend",
            transition: "transitionend"
        };
        for (var t in transitions) {
            if (element.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }
    function ProgressButtonConfig() {
        var profiles = {};
        var defaultProfile = null;
        var defaultProgressButtonConfig = {
            style: "fill",
            direction: "horizontal",
            randomProgress: true
        };
        this.profile = function(profileName, options) {
            if (arguments.length === 1) {
                if (defaultProfile) {
                    throw Error("Default profile already set.");
                }
                defaultProfile = profileName;
            } else {
                if (profiles[profileName]) {
                    throw Error("Profile [" + profileName + "] aready set.");
                }
                profiles[profileName] = options;
            }
        };
        this.$get = function() {
            return {
                getProfile: function(profileName) {
                    if (profileName && profiles[profileName]) {
                        return profiles[profileName];
                    } else {
                        return defaultProfile || defaultProgressButtonConfig;
                    }
                }
            };
        };
    }
    function ProgressButton($q, ngProgressButtonConfig, $interval) {
        return {
            restrict: "A",
            transclude: true,
            scope: {
                pbStyle: "@",
                pbDirection: "@",
                pbProfile: "@",
                ngProgressButton: "="
            },
            template: '<span class="content" ng-transclude></span>' + '<span class="progress">' + '<span class="progress-inner" ng-style="progressStyles" ng-class="{ notransition: !allowProgressTransition }"></span>' + "</span>",
            controller: function() {},
            link: function($scope, $element, $attrs) {
                function _configure() {
                    var profile = ngProgressButtonConfig.getProfile($scope.pbProfile);
                    $scope.pbStyle = $scope.pbStyle || profile.style || "fill";
                    if ($scope.pbStyle !== "lateral-lines") {
                        $scope.pbDirection = $scope.pbDirection || profile.direction || "horizontal";
                    } else {
                        $scope.pbDirection = "vertical";
                    }
                    $scope.pbPerspective = $scope.pbStyle.indexOf("rotate") === 0 || $scope.pbStyle.indexOf("flip-open") === 0;
                    $scope.pbRandomProgress = $attrs.pbRandomProgress ? $attrs.pbRandomProgress !== "false" : profile.randomProgress || true;
                }
                _configure();
                var transitionEndEventName = whichTransitionEnd($element[0]);
                var progressProperty = $scope.pbDirection === "vertical" ? "height" : "width";
                function setProgress(val) {
                    $scope.progressStyles[progressProperty] = 100 * val + "%";
                }
                function runProgressInterval() {
                    var progress = 0;
                    return $interval(function() {
                        progress += (1 - progress) * Math.random() * .5;
                        setProgress(progress);
                    }, 200);
                }
                function enable() {
                    $scope.$apply(function() {
                        $scope.disabled = false;
                    });
                }
                function doStop(status) {
                    function onOpacityTransitionEnd(ev) {
                        if (ev.propertyName !== "opacity" && (!ev.originalEvent || ev.originalEvent.propertyName !== "opacity")) {
                            return;
                        }
                        $element.off(transitionEndEventName, onOpacityTransitionEnd);
                        $scope.$apply(function() {
                            $scope.allowProgressTransition = false;
                            setProgress(0);
                            $scope.progressStyles.opacity = 1;
                        });
                    }
                    if (transitionEndEventName) {
                        $scope.progressStyles.opacity = 0;
                        $element.on(transitionEndEventName, onOpacityTransitionEnd);
                    }
                    if (typeof status === "number") {
                        var statusClass = status >= 0 ? "state-success" : "state-error";
                        $element.addClass(statusClass);
                        setTimeout(function() {
                            $element.removeClass(statusClass);
                            enable();
                        }, 1500);
                    } else {
                        enable();
                    }
                    $element.removeClass("state-loading");
                }
                if ($scope.pbPerspective) {
                    var wrap = angular.element('<span class="progress-wrap"></span>');
                    wrap.append($element.children());
                    $element.append(wrap);
                    $element.addClass("progress-button-perspective");
                }
                $scope.progressStyles = {};
                $scope.disabled = false;
                $scope.allowProgressTransition = false;
                $element.addClass("progress-button");
                $element.addClass("progress-button-dir-" + $scope.pbDirection);
                $element.addClass("progress-button-style-" + $scope.pbStyle);
                $scope.$watch("disabled", function(newValue) {
                    $element.toggleClass("disabled", newValue);
                });
                $scope.$watch("ngProgressButton", function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if ($scope.disabled) {
                            return;
                        }
                        $scope.disabled = true;
                        $element.addClass("state-loading");
                        $scope.allowProgressTransition = true;
                        var interval = null;
                        $q.when(newValue).then(function success() {
                            setProgress(1);
                            if (interval) {
                                $interval.cancel(interval);
                            }
                            doStop(1);
                        }, function error() {
                            if (interval) {
                                $interval.cancel(interval);
                            }
                            doStop(-1);
                        }, function notify(arg) {
                            if (!$scope.pbRandomProgress) {
                                setProgress(arg);
                            }
                        });
                        if ($scope.pbRandomProgress) {
                            interval = runProgressInterval();
                        }
                    }
                });
            }
        };
    }
    var mdl = angular.module("ngProgressButtonStyles", []);
    mdl.provider("ngProgressButtonConfig", ProgressButtonConfig);
    mdl.directive("ngProgressButton", ProgressButton);
    ProgressButton.$inject = [ "$q", "ngProgressButtonConfig", "$interval" ];
})(angular);
//# sourceMappingURL=ng-progress-button-styles.js.map
