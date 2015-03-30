angular.module('PokerTimer', []);
angular.module('PokerTimer')
	.value('config', {
		time: 0.1,
		smallBlind: 25,
		anteRound: 0,
		ante: 100
	})
	.value('invertColors', { value: false })
	.value('configVisible', { value: false })

	.filter('displayTime', function () {
		return function (input) {
			var inputAsSeconds = input / 1000;
			var seconds = (inputAsSeconds) % 60;
			var minutes = (inputAsSeconds - seconds) / 60;

			var secondString = seconds.toString();
			if (secondString.length < 2) {
				secondString = "0" + secondString;
			}

			return minutes + ":" + secondString;

		};
	})
	.controller('TimeController', function ($scope, $interval, $timeout, config, BeepService) {
		var interval;
		var blinkInterval;

		$scope.blink = false;

		function setStartValues() {
			$scope.mins = config.time;
			$scope.smallBlind = config.smallBlind;
			$scope.ante = config.ante;
			$scope.anteRound = config.anteRound;
			$scope.counter = $scope.mins * 60 * 1000;
			$scope.running = false;
			$scope.round = 1;
		}

		setStartValues();

		function startNextRound() {
			$scope.stop();
			$scope.running = true;
			$scope.counter = 0;
			$timeout(function () {
				$scope.counter = $scope.mins * 60 * 1000;
				$scope.round++;
				$scope.smallBlind = $scope.smallBlind * 2;

				if ($scope.round >= $scope.anteRound) {
					$scope.ante = $scope.ante * 2;
				}
				$scope.start();
			}, 1000);

		}

		function stopBlink() {
			$scope.blink = false;
			$interval.cancel(blinkInterval);
			blinkInterval = undefined;
		}

		function startBlink() {
			blinkInterval = $interval(function () {
				if ($scope.running) {
					$scope.blink = !$scope.blink;
					if ($scope.blink && $scope.counter <= 15000) {
						BeepService.play();
					}
				} else {
					stopBlink();
				}
			}, 500);
		}

		$scope.start = function () {
			interval = $interval(function () {
				$scope.counter -= 1000;

				if ($scope.counter <= 0) {
					startNextRound();
				} else {
					if ($scope.counter <= 60000 && blinkInterval === undefined) {
						startBlink();
					}
				}
			}, 1000);

			$scope.running = true;
		};

		$scope.stop = function () {
			if (interval) {
				$interval.cancel(interval);
				$scope.running = false;
			}
		};

		$scope.reset = function () {
			$scope.stop();
			setStartValues();
		};
	})
	.controller('SecondaryToolbarController', function ($scope, invertColors, configVisible) {
		$scope.toggleInvert = function () {
			invertColors.value = !invertColors.value;
		};

		$scope.toggleConfig = function () {
			configVisible.value = !configVisible.value;
		};
	})
	.controller('ConfigController', function ($scope, config, configVisible) {
		$scope.configVisible = configVisible;
		$scope.config = config;
	})
	.controller('WrapperController', function ($scope, invertColors) {
		$scope.inverted = invertColors;
	})
	.service('BeepService', function () {
		var beepElement = document.getElementById('beep');

	return {
		play: function() {
			beepElement.play();
		}
	};
});