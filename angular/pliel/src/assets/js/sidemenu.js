document.addEventListener('AngularComponentRendered', function () {

  var ANIMATION_DURATION = 300;

  var SIDEBAR_EL = document.getElementById("sidebar");

  var SUB_MENU_ELS = document.querySelectorAll(".menu > ul > .menu-item.sub-menu");

  var FIRST_SUB_MENUS_BTN = document.querySelectorAll(".menu > ul > .menu-item.sub-menu > a");

  var INNER_SUB_MENUS_BTN = document.querySelectorAll(".menu > ul > .menu-item.sub-menu .menu-item.sub-menu > a");

  function PopperObject(reference, popperTarget) {
    this.init(reference, popperTarget);
  }

  PopperObject.prototype.init = function(reference, popperTarget) {
    this.reference = reference;
    this.popperTarget = popperTarget;
    this.instance = Popper.createPopper(this.reference, this.popperTarget, {
      placement: "right",
      strategy: "fixed",
      resize: true,
      modifiers: [{
        name: "computeStyles",
        options: {
          adaptive: false
        }
      }, {
        name: "flip",
        options: {
          fallbackPlacements: ["left", "right"]
        }
      }]
    });

    document.addEventListener("click", (function(e) {
      this.clicker(e, this.popperTarget, this.reference);
    }).bind(this), false);

    var ro = new ResizeObserver((function() {
      this.instance.update();
    }).bind(this));

    ro.observe(this.popperTarget);
    ro.observe(this.reference);
  };

  PopperObject.prototype.clicker = function(event, popperTarget, reference) {
    if (SIDEBAR_EL.classList.contains("collapsed") && !popperTarget.contains(event.target) && !reference.contains(event.target)) {
      this.hide();
    }
  };

  PopperObject.prototype.hide = function() {
    this.instance.state.elements.popper.style.visibility = "hidden";
  };

  function Poppers() {
    this.subMenuPoppers = [];
    this.init();
  }

  Poppers.prototype.init = function() {
    SUB_MENU_ELS.forEach((function(element) {
      this.subMenuPoppers.push(new PopperObject(element, element.lastElementChild));
      this.closePoppers();
    }).bind(this));
  };

  Poppers.prototype.togglePopper = function(target) {
    if (window.getComputedStyle(target).visibility === "hidden") target.style.visibility = "visible";
    else target.style.visibility = "hidden";
  };

  Poppers.prototype.updatePoppers = function() {
    this.subMenuPoppers.forEach((function(element) {
      element.instance.state.elements.popper.style.display = "none";
      element.instance.update();
    }).bind(this));
  };

  Poppers.prototype.closePoppers = function() {
    this.subMenuPoppers.forEach((function(element) {
      element.hide();
    }).bind(this));
  };

  const slideUp = (target, duration = ANIMATION_DURATION) => {
    const { parentElement } = target;
    parentElement.classList.remove("open");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = `${duration}ms`;
    target.style.boxSizing = "border-box";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.style.display = "none";
      target.style.removeProperty("height");
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
    }, duration);
  };
  const slideDown = (target, duration = ANIMATION_DURATION) => {
    const { parentElement } = target;
    parentElement.classList.add("open");
    target.style.removeProperty("display");
    let { display } = window.getComputedStyle(target);
    if (display === "none") display = "block";
    target.style.display = display;
    const height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.boxSizing = "border-box";
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = `${duration}ms`;
    target.style.height = `${height}px`;
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout(() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
    }, duration);
  };

  const slideToggle = (target, duration = ANIMATION_DURATION) => {
    if (window.getComputedStyle(target).display === "none")
      return slideDown(target, duration);
    return slideUp(target, duration);
  };

  const PoppersInstance = new Poppers();

  /**
   * wait for the current animation to finish and update poppers position
   */
  const updatePoppersTimeout = () => {
    setTimeout(() => {
      PoppersInstance.updatePoppers();
    }, ANIMATION_DURATION);
  };

  /**
   * sidebar collapse handler
   */
  document.getElementById("btn-collapse").addEventListener("click", () => {
    SIDEBAR_EL.classList.toggle("collapsed");
    PoppersInstance.closePoppers();
    if (SIDEBAR_EL.classList.contains("collapsed"))
      FIRST_SUB_MENUS_BTN.forEach((element) => {
        element.parentElement.classList.remove("open");
      });

    updatePoppersTimeout();
  });

  var SIDEBAR_EL = document.getElementById("sidebar");
  if (!SIDEBAR_EL.classList.contains("collapsed")) {
    SIDEBAR_EL.classList.add("collapsed");
  }

  /**
   * sidebar toggle handler (on break point )
   */
  document.getElementById("btn-toggle").addEventListener("click", () => {
    SIDEBAR_EL.classList.toggle("toggled");
    SIDEBAR_EL.classList.remove("collapsed");
    updatePoppersTimeout();
  });

  /**
   * toggle sidebar on overlay click
   */
  document.getElementById("overlay").addEventListener("click", () => {
    SIDEBAR_EL.classList.toggle("toggled");
  });

  const defaultOpenMenus = document.querySelectorAll(".menu-item.sub-menu.open");

  defaultOpenMenus.forEach((element) => {
    element.lastElementChild.style.display = "block";
  });

  /**
   * handle top level submenu click
   */
  FIRST_SUB_MENUS_BTN.forEach((element) => {
    element.addEventListener("click", () => {
      if (SIDEBAR_EL.classList.contains("collapsed"))
        PoppersInstance.togglePopper(element.nextElementSibling);
      else {
        const parentMenu = element.closest(".menu.open-current-submenu");
        if (parentMenu)
          parentMenu
            .querySelectorAll(":scope > ul > .menu-item.sub-menu > a")
            .forEach(
              (el) =>
                window.getComputedStyle(el.nextElementSibling).display !==
                  "none" && slideUp(el.nextElementSibling)
            );
        slideToggle(element.nextElementSibling);
      }
    });
  });

  /**
   * handle inner submenu click
   */
  INNER_SUB_MENUS_BTN.forEach((element) => {
    element.addEventListener("click", () => {
      slideToggle(element.nextElementSibling);
    });
  });

});