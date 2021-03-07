// @ts-check

function init($) {
  const pool = [];

  $(function() {
    const signInBtn = $("#signIn");
    const signUpBtn = $("#signUp");
    const signupForm = $("#signupForm");
    const signinForm = $("#signinForm");
    const container = $(".container");

    signInBtn.on("click", () => {
      container.removeClass("right-panel-active");
    });

    signUpBtn.on("click", () => {
      container.addClass("right-panel-active");
    });

    $(".form").each(function() {
      const $form = $(this);
      const $formInputs = $form.find('input').filter('[required]');

      $formInputs.each(function() {
        $(this).on("keyup", e => {
          handleValidation(e, $formInputs.length);
        });
      });
    });

    signupForm.on("submit", submitSignup);
    signinForm.on("submit", submitLogin);
  });

  const submitLogin = function(e) {
    e.preventDefault();
  };

  const submitSignup = function(e) {
    e.preventDefault();
    const $form = $(this);

    $.ajax({
      type: "POST",
      url: '',
      data: $form.serialize(),
      success: function(data) {
        handleSignupSuccess(data);
      },
      error: function (_xhr, textStatus, errorThrown) {
        handleSignupError();
        console.warn(`Failed to create new user with status code: ${textStatus} (${errorThrown})`);
      },
    });

    return false;
  }

  const handleSignupSuccess = data => {
    console.log(data);
  };
  const handleSignupError = () => {
    console.log('Failed signup');
  };

  const uniquePush = (item = '', targetArr = []) => {
    if (targetArr.indexOf(item) === -1) {
      targetArr.push(item);
    }
  };

  const removeFromArray = (arr, item) => {
    const idx = arr.indexOf(item);
    if (idx > 0) {
      arr.splice(idx, 1);
    }
  };

  const isValidEmail = email => {
    if (!email) {
      return false;
    }
    const pattern = new RegExp('^([a-zA-Z0-9_\\.\\-])+\\@(([a-zA-Z0-9\\-])+\\.)+([a-zA-Z0-9]{2,4})+$');
    return pattern.test(email);
  };

  const handleValidation = (e, allItemsCount) => {
    const $input = $(e.target || e.srcElement);
    const $form = $input.closest('form');
    const $submitBtn = $form.find('[type=submit]');

    const type = $input.attr('type');
    const name = $input.attr('name');
    const val = $input.val();

    if (type === 'text' || type === 'number') {
      if (val === '') {
        removeFromArray(pool, name);
      } else {
        uniquePush(name, pool);
      }
    }

    if (type === 'email') {
      if (val === '') {
        removeFromArray(pool, name);
      } else {
        const $emailError = $form.find(".emailError");

        if (isValidEmail(val)) {
          uniquePush(name, pool);
          $emailError.text('');
        } else {
          $emailError.text('Invalid email');
          removeFromArray(pool, name);
        }
      }
    }

    if (type === 'password') {
      if (val === '') {
        removeFromArray(pool, name);
      } else {
        const $siblingInput = $input.siblings('input[type=password]');

        if ($siblingInput && $siblingInput.length) {
          const rePwdVal = $siblingInput.val();

          // Empty check to avoid early false error detection
          if (rePwdVal !== '') {
            const $pwdError = $form.find(".pwdError");
            // Passwords do not match
            if (val !== rePwdVal) {
              $pwdError.text('Passwords do not match');
              removeFromArray(pool, name);
            } else {
              $pwdError.text('');
              uniquePush(name, pool);
            }
          }
        } else {
          uniquePush(name, pool);
        }
      }
    }

    $submitBtn.attr('disabled', allItemsCount > pool.length);
  };
}

let timeout;
function runtime() {
  if (window['$'] || window['jQuery']) {
    clearTimeout(timeout);
    init(window['$']);
  } else {
    timeout = setTimeout(() => {
      runtime();
    }, 50);
  }
}

runtime();
