// @ts-check

function init($) {
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

    signupForm.on("submit", submitSignup);
    signinForm.on("submit", submitLogin);
  });

  const submitLogin = e => {
    e.preventDefault();
  };

  const submitSignup = e => {
    e.preventDefault();
  }
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
