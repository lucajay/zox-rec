// @ts-check

const API_SIGNUP = "https://zxrec.herokuapp.com/signup/signup";

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
    const $submitBtn = $form.find('[type=submit]');
    $submitBtn.prop("disabled", true);

    $.ajax({
      type: "POST",
      url: API_SIGNUP,
      data: $form.serialize(),
      success: function(data) {
        handleSignupSuccess(data);
      },
      error: function (xhr, textStatus, errorThrown) {
        handleSignupError((xhr.responseJSON || {}).message);
        console.warn(`Failed to create new user with status code: ${textStatus} (${errorThrown})`);
      },
      complete: function() {
        $submitBtn.prop("disabled", false);
      }
    });

    return false;
  }

  const handleSignupSuccess = data => {
    if (data && data.succes) {
      const $signUpMsg = $("#singnUpMsg");
      if (data.status === 200) {
        $signUpMsg.text(data.message);
      }
    } else {
      handleSignupError();
    }
  };
  const handleSignupError = (msg = '') => {
    const $signUpMsg = $("#singnUpMsg");
    const _msg = msg || "Failed to create user";
    $signUpMsg.text(_msg);
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

  const isValidPhone = mobileNum => {
    if (!mobileNum) {
      return false;
    }
    return /^[6-9]\d{9}$/g.test(mobileNum);
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

    if (type === 'tel') {
      if (val === '') {
        removeFromArray(pool, name);
      } else {
        const $phoneError = $form.find(".phoneError");
        if (isValidPhone(val)) {
          uniquePush(name, pool);
          $phoneError.text('');
        } else {
          $phoneError.text('Invalid mobile number');
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
          } else {
            uniquePush(name, pool);
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
