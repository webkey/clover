var $WINDOW = $(window),
    $HTML = $('html'),
    $BODY = $('body');

/**
 * !Detects overlay scrollbars (when scrollbars on overflowed blocks are visible).
 * This is found most commonly on mobile and OS X.
 * */
var HIDDEN_SCROLL = Modernizr.hiddenscroll;
var NO_HIDDEN_SCROLL = !HIDDEN_SCROLL;
var TOUCHEVENTS = ("ontouchstart" in document.documentElement);

/**
 * !Add touchscreen classes
 * */
function addTouchClasses() {
  if (TOUCHEVENTS) {
    document.documentElement.className += " touchevents";
  } else {
    document.documentElement.className += " no-touchevents";
  }
}

/**
 * !Initial full page scroll plugin
 * */
function fullPageInitial() {
  var $fpSections = $('.fp-sections-js'),
      fpSectionSelector = '.fp-section-js',
      $fpSection = $(fpSectionSelector),
      $word = $('.menu-item__bg-text', $fpSections).find('span'),
      parallaxValue = 0.8,
      duration = 750,
      breakpointWidth = 992,
      breakpointHeight = 400;

  function historyAnchors() {
    var anchors = [];

    $.each($fpSection, function (i, el) {
      anchors.push('section' + (i + 1));
    });

    return anchors;
  }

  if($fpSections.length) {
    $fpSections.fullpage({
      css3: true,
      licenseKey: '11111111-11111111-11111111-11111111',
      verticalCentered: false,
      anchors: historyAnchors(),
      recordHistory: false,
      scrollingSpeed: duration,
      sectionSelector: fpSectionSelector,
      responsiveWidth: breakpointWidth, // and add css rule .fp-enabled
      responsiveHeight: breakpointHeight, // and add css rule .fp-enabled
      navigation: false,
      onLeave: function (origin, destination, direction) {
        $(destination.item).addClass('s-ready');

        if (window.innerWidth >= breakpointWidth && window.innerHeight >= breakpointHeight) {
          var $spaceTop = destination.item.offsetTop + destination.item.clientHeight - window.innerHeight;
          var scrollValue = $spaceTop * parallaxValue;

          if ($word.length) {
            $word.css({
              'transform': 'translate3d(' + scrollValue + 'px, 0px, 0px)',
              'transition': 'all ' + duration / 1000 + 's'
            });
          }
        }

        // Добавлять класс светлой темы
        $HTML.removeClass('theme-light');

        if (!$HTML.hasClass('theme-light') && $(destination.item).attr('data-theme') === "light") {
          $HTML.addClass('theme-light');
        }

        // Менять цвет фона
        var bgColor = $(destination.item).attr('data-bg-color');
        if (bgColor && bgColor.length) {
          $BODY.css('background-color', bgColor);
        } else {
          $BODY.css('background-color', '');
        }

        if(destination.isLast) {
          console.log("$(destination.item).eq(3): ", $(destination.item));
          $BODY.css('background-color', $(destination.item).prev().attr('data-bg-color'));
        }
      },
      afterLoad: function(origin, destination, direction){
        $('.logo-js').on('click', function (e) {
          fullpage_api.moveTo(1);
          e.preventDefault();
        })
      },
    });
  }

  $('.btn-next-section-js').on('click', function (e) {
    if($fpSections.length) {
      fullpage_api.moveSectionDown();
    }
    e.preventDefault();
  });

  $('.btn-to-section-js').on('click', function (e) {
    var $thisBtn = $(this);
    if($fpSections.length) {
      fullpage_api.moveTo($($thisBtn.attr('href')).index() + 1);
    }
    e.preventDefault();
  });
}

/**
 * !Add placeholder for old browsers
 * */
function placeholderInit() {
  $('[placeholder]').placeholder();
}

/**
 * !Add classes to form elements
 * if they has a value or they are in focus
 * */
function formElementState() {
  var $elem = $('.field-js');
  
  if ($elem.length) {
    function toggleStateClass(mod, cond) {
      var $this = $(this);
      $this.add($this.prev('label')).toggleClass(mod, cond);
    }

    // Focus
    $elem.on('focus blur', function (e) {
      toggleStateClass.call(this, 'focused', e.handleObj.origType === "focus");
    });

    // Has value
    $.each($elem, function () {
      toggleStateClass.call(this, 'filled', $(this).val().length !== 0);
    });

    $elem.on('keyup change', function () {
      toggleStateClass.call(this, 'filled', $(this).val().length !== 0);
    });
  }
}

/**
 * !Initial custom select for cross-browser styling
 * */
function customSelect() {
  var $select = $('select.cselect');

  if ($select.length) {
    $.each($select, function () {
      var $thisSelect = $(this);
      $thisSelect.select2({
        theme: 'custom',
        language: 'ru',
        width: '100%',
        containerCssClass: 'cselect-head',
        dropdownCssClass: 'cselect-drop'
      });
    })
  }
}

/**
 * !Main navigation
 */
function mainNavigation() {
  var $nav = $('.nav-js');
  if ($nav.length) {

    $nav.nav({
      submenuPosition: false,
    });
  }
}

$('.nav-opener-js').on('click', function (e) {
  var $curBtn = $(this);

  $curBtn.add($($curBtn.attr('href'))).addClass('is-open');

  $HTML.addClass('css-scroll-fixed open-only-mob');

  e.preventDefault();
});

function hideNav() {
  $('.is-open').removeClass('is-open');
  $HTML.removeClass('css-scroll-fixed open-only-mob');
}

$('.nav-close-btn-js').on('click', function (e) {
  hideNav();

  e.preventDefault();
});

$('.nav-overlay').on('click', function () {
  hideNav();
});

$HTML.keyup(function (event) {
  if (event.keyCode === 27) {
    hideNav();
  }
});







/**
 * !Form validation
 * */
function formValidation() {
  $.validator.setDefaults({
    submitHandler: function() {
      alert('Форма находится в тестовом режиме. Чтобы закрыть окно, нажмите ОК.');
      return false;
    }
  });

  var $form = $('.validate-js');

  if ($form.length) {
    var changeClasses = function (elem, remove, add) {
      // console.log('changeClasses');
      elem
          .removeClass(remove).addClass(add);
      elem
          .closest('form').find('label[for="' + elem.attr('id') + '"]')
          .removeClass(remove).addClass(add);
      elem
          .closest('.input-wrap')
          .removeClass(remove).addClass(add);
    };

    $.each($form, function (index, element) {
      $(element).validate({
        errorClass: "error",
        validClass: "success",
        errorElement: false,
        errorPlacement: function (error, element) {
          return true;
        },
        highlight: function (element, errorClass, successClass) {
          changeClasses($(element), successClass, errorClass);
        },
        unhighlight: function (element, errorClass, successClass) {
          changeClasses($(element), errorClass, successClass);
        }
      });
    });
  }
}

/**
 * =========== !ready document, load/resize window ===========
 */

$(window).on('load', function () {
  // add functions
});

$(window).on('debouncedresize', function () {
  // $(document.body).trigger("sticky_kit:recalc");
});

$(document).ready(function () {
  // Base
  addTouchClasses();
  fullPageInitial();
  placeholderInit();
  formElementState();
  customSelect();
  objectFitImages(); // object-fit-images initial
  // Common
  mainNavigation();

  formValidation();
});