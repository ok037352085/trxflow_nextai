"use strict";

document.addEventListener("DOMContentLoaded", function () {
	gsap.registerPlugin(ScrollTrigger, Flip, SplitText, DrawSVGPlugin, ScrollSmoother);
	const body = document.querySelector("body");

	/**
	 * Slide Up
	 */
	const slideUp = (target, duration = 500) => {
		if (!target) return;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.boxSizing = "border-box";
		target.style.height = target.offsetHeight + "px";
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

	/**
	 * Slide Down
	 */
	const slideDown = (target, duration = 500) => {
		if (!target) return;
		target.style.removeProperty("display");
		let display = window.getComputedStyle(target).display;
		if (display === "none") display = "block";
		target.style.display = display;
		let height = target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.boxSizing = "border-box";
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = height + "px";
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

	/**
	 * Slide Toggle
	 */
	const slideToggle = (target, duration = 500) => {
		if (!target) return;
		if (target.style === undefined || target.style.display === "none") {
			return slideDown(target, duration);
		}
		return slideUp(target, duration);
	};

	/**
	 * Header Crossed
	 */
	let scrollTimeout;
	window.addEventListener("scroll", () => {
		if (!body) return;
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(() => {
			const primaryHeader = document.querySelector(".primary-header");
			if (primaryHeader) {
				const primaryHeaderTop = primaryHeader.offsetHeight / 3;
				const scrolled = window.scrollY;
				if (scrolled > primaryHeaderTop) {
					body.classList.add("primary-header-crossed");
				} else {
					body.classList.remove("primary-header-crossed");
				}
			}
		}, 100);
	});

	/**
	 * Primary Menu
	 */
	const mdScreen = "(max-width: 991px)";
	const primaryHeader = document.querySelector(".primary-header");
	if (primaryHeader) {
		primaryHeader.addEventListener("click", function (e) {
			const target = e.target.closest(".has-sub-menu > a, .has-sub-2nd > a");
			if (!target) return;
			const isMobile = window.matchMedia(mdScreen).matches;
			if (isMobile) {
				e.preventDefault();
				e.stopPropagation();
				target.classList.toggle("active");
				const menuSub = target.nextElementSibling;
				if (menuSub) {
					slideToggle(menuSub, 500);
				}
			} else {
				if (!target.getAttribute("href") || target.getAttribute("href") === "#") {
					e.preventDefault();
				}
			}
		});
		window.matchMedia(mdScreen).addEventListener("change", function (e) {
			const subMenus = primaryHeader.querySelectorAll(
				".navigation-0__menu, .navigation-1__menu, .navigation-1__sub-menu"
			);
			if (!subMenus.length) return;
			for (let i = 0; i < subMenus.length; i++) {
				const menu = subMenus[i];
				if (menu.style.display !== "none") {
					slideUp(menu, 0);
					const parentLink = menu.previousElementSibling;
					if (parentLink) {
						parentLink.classList.remove("active");
					}
				}
			}
		});
	}

	/**
	 * Theme Settings (Dark / Light)
	 */
	const themeDropdown = document.querySelector(".theme-settings");
	const themeDropdownIcon = document.getElementById("themeDropdownIcon");
	const savedTheme = localStorage.getItem("theme");
	if (savedTheme === "dark") {
		document.documentElement.setAttribute("data-bs-theme", "dark");
		updateThemeIcon("dark");
	} else {
		document.documentElement.setAttribute("data-bs-theme", "light");
		updateThemeIcon("light");
	}
	if (themeDropdown) {
		themeDropdown.addEventListener("click", function (e) {
			const target = e.target.closest("#lightTheme, #darkTheme");
			if (!target) return;
			const theme = target.id === "lightTheme" ? "light" : "dark";
			document.documentElement.setAttribute("data-bs-theme", theme);
			localStorage.setItem("theme", theme);
			updateThemeIcon(theme);
		});
	}
	function updateThemeIcon(theme) {
		if (!themeDropdownIcon) return;
		themeDropdownIcon.setAttribute(
			"icon",
			theme === "light" ? "bi:sun" : "bi:moon-stars"
		);
	}

	/**
	 * Iterate through each tab group
	 */
	document.addEventListener("click", function (e) {
		const button = e.target.closest(".tab-group .tab__links");
		if (!button) return;

		const group = button.closest(".tab-group");
		if (!group) return;

		const tabButtons = group.querySelectorAll(".tab__links");
		const tabContents = group.querySelectorAll(".tab__content");
		const index = Array.prototype.indexOf.call(tabButtons, button);

		tabButtons.forEach((btn) => btn.classList.remove("active"));
		tabContents.forEach((content) => content.classList.remove("active"));

		button.classList.add("active");
		if (tabContents[index]) {
			tabContents[index].classList.add("active");
		}
	});

	// Initialize first tab in each group
	document.querySelectorAll(".tab-group").forEach((group) => {
		const firstTab = group.querySelector(".tab__links");
		if (firstTab) firstTab.click();
	});

	/**
	 * Code Snippets Expand
	 */
	document.addEventListener("click", function (e) {
		const button = e.target.closest(".code-snippet-expand");
		if (!button) return;
		const codeExpandNav = button.closest(".tab__header");
		const codeSnippetsBody = codeExpandNav.nextElementSibling;
		if (codeSnippetsBody) {
			codeSnippetsBody.classList.toggle("code-snippet--expanded");
		}
	});

	/**
	 * Tooltip Init
	 */
	const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
	if (tooltipTriggerList.length) {
		const tooltipList = [];
		for (let i = 0; i < tooltipTriggerList.length; i++) {
			tooltipList.push(new bootstrap.Tooltip(tooltipTriggerList[i]));
		}
	}

	/**
	 * Dropdown Activate
	 */
	const dropdownElementList = document.querySelectorAll('[data-bs-toggle="dropdown"]');
	if (dropdownElementList.length) {
		const dropdownList = [];
		for (let i = 0; i < dropdownElementList.length; i++) {
			dropdownList.push(new bootstrap.Dropdown(dropdownElementList[i]));
		}
	}

	/**
	 * Testimonial Slider 1
	 */
	const testimonialSliderOne = document.querySelector(".testimonial-slider-1");
	if (testimonialSliderOne) {
		new Swiper(testimonialSliderOne, {
			loop: true,
			centeredSlides: true,
			centeredSlidesBounds: true,
			speed: 1000,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			slidesPerView: 1,
			breakpoints: {
				768: { slidesPerView: 2 },
				992: { slidesPerView: 3 },
				1400: { slidesPerView: 4 },
				1920: { slidesPerView: 5 },
			},
		});
	}

	/**
	 * Testimonial Slider 2
	 */
	const testimonialSliderTwo = document.querySelector(".testimonial-slider-2");
	if (testimonialSliderTwo) {
		new Swiper(testimonialSliderTwo, {
			loop: true,
			centeredSlides: true,
			centeredSlidesBounds: true,
			speed: 1000,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
				reverseDirection: true,
			},
			slidesPerView: 1,
			breakpoints: {
				768: { slidesPerView: 2 },
				992: { slidesPerView: 3 },
				1400: { slidesPerView: 4 },
				1920: { slidesPerView: 5 },
			},
		});
	}

	/**
	 * Testimonial Slider 3
	 */
	const testimonialSliderThree = document.querySelector(".testimonial-slider-3__is");
	if (testimonialSliderThree) {
		new Swiper(testimonialSliderThree, {
			loop: true,
			autoplay: {
				delay: 3000,
			},
			slidesPerView: 1,
			effect: "fade",
			fadeEffect: { crossFade: true },
		});
	}

	/**
	 * Testimonial Slider 4
	 */
	const testimonialSliderFour = document.querySelector(".testimonial-slider-4");
	const testimonialSliderFourThumb = document.querySelector(
		".testimonial-slider-4__thumb"
	);
	if (testimonialSliderFourThumb && testimonialSliderFour) {
		const testimonialSliderFourThumbIs = new Swiper(testimonialSliderFourThumb, {
			loop: true,
			spaceBetween: 16,
			slidesPerView: 1,
			freeMode: true,
			watchSlidesProgress: true,
			centeredSlides: true,
			centeredSlidesBounds: true,
			centerInsufficientSlides: true,
			breakpoints: {
				576: { slidesPerView: 2 },
				768: { slidesPerView: 3 },
			},
		});
		const testimonialSliderFourIs = new Swiper(testimonialSliderFour, {
			loop: true,
			slidesPerView: 1,
			autoplay: {
				delay: 3000,
			},
			effect: "fade",
			fadeEffect: { crossFade: true },
			thumbs: { swiper: testimonialSliderFourThumbIs },
		});
	}

	/**
	 * Team Member 2 Slider
	 */
	const teamMemberTwoSlider = document.querySelector(".team-member-2-slider");
	if (teamMemberTwoSlider) {
		new Swiper(teamMemberTwoSlider, {
			loop: true,
			centeredSlides: true,
			centeredSlidesBounds: true,
			speed: 1000,
			spaceBetween: 16,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			slidesPerView: 1,
			breakpoints: {
				768: { slidesPerView: 2 },
				992: { slidesPerView: 3 },
				1400: { slidesPerView: 4 },
				1920: { slidesPerView: 5 },
			},
		});
	}

	/**
	 * Duplicate Scroller-X Item
	 */
	const scrollerX = document.querySelectorAll(".scroller-x");
	function scrollerXDuplication(scroller) {
		if (scroller.dataset.duplicated === "true") return;
		const scrollerInner = scroller.querySelector(".scroller-x__list");
		if (!scrollerInner) return;
		const scrollerContent = Array.from(scrollerInner.children);
		if (!scrollerContent.length) return;
		const fragment = document.createDocumentFragment();
		scrollerContent.forEach((item) => {
			const duplicateItem = item.cloneNode(true);
			fragment.appendChild(duplicateItem);
		});
		scrollerInner.appendChild(fragment);
		scroller.dataset.duplicated = "true";
	}
	scrollerX.forEach((scroller) => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						scrollerXDuplication(entry.target);
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0 }
		);
		observer.observe(scroller);
	});

	/**
	 * Duplicate Scroller-Y Item
	 */
	const scrollerY = document.querySelectorAll(".scroller-y");
	function scrollerYDuplication(scroller) {
		if (scroller.dataset.duplicated === "true") return;
		const scrollerInner = scroller.querySelector(".scroller-y__list");
		if (!scrollerInner) return;
		const scrollerContent = Array.from(scrollerInner.children);
		if (!scrollerContent.length) return;
		const fragment = document.createDocumentFragment();
		scrollerContent.forEach((item) => {
			const duplicateItem = item.cloneNode(true);
			fragment.appendChild(duplicateItem);
		});
		scrollerInner.appendChild(fragment);
		scroller.dataset.duplicated = "true";
	}
	scrollerY.forEach((scroller) => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						scrollerYDuplication(entry.target);
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0 }
		);
		observer.observe(scroller);
	});

	/**
	 * Case Study Slider
	 */
	const caseStudySlider = document.querySelector(".case-study-slider");
	if (caseStudySlider) {
		new Swiper(caseStudySlider, {
			slidesPerView: 1,
			spaceBetween: 16,
			navigation: {
				nextEl: ".case-study-slider__next",
				prevEl: ".case-study-slider__prev",
			},
			breakpoints: {
				1200: { slidesPerView: 2 },
			},
		});
	}

	/**
	 * Orbit Animation
	 */
	function createOrbitAnimation(
		orbitContainer,
		planetCount = 6,
		radius = "50%",
		duration = 30000
	) {
		if (!orbitContainer || !orbitContainer.querySelector(".orbit__planet")) return;
		const orbit = orbitContainer;
		let radiusInPixels;
		const calculateRadius = () => {
			if (typeof radius === "string" && radius.includes("%")) {
				const percentage = parseFloat(radius) / 100;
				radiusInPixels = orbit.offsetWidth * percentage;
			} else {
				radiusInPixels = parseFloat(radius);
			}
		};
		calculateRadius();
		orbit.innerHTML = "";
		for (let i = 0; i < planetCount; i++) {
			const planet = document.createElement("span");
			planet.classList.add("orbit__planet");
			orbit.appendChild(planet);
		}
		const updatePlanetPositions = (progress) => {
			const children = orbit.children;
			for (let i = 0; i < children.length; i++) {
				const planet = children[i];
				const angle = (i * 360) / planetCount + progress * 360;
				const x = radiusInPixels * Math.cos((angle * Math.PI) / 180);
				const y = radiusInPixels * Math.sin((angle * Math.PI) / 180);
				planet.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
			}
		};
		const tl = gsap.timeline({ repeat: -1 });
		tl.to(orbit, {
			rotation: 360,
			duration: duration / 1000,
			ease: "linear",
			onUpdate: function () {
				updatePlanetPositions(this.progress());
			},
		});
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						tl.play();
					} else {
						tl.pause();
					}
				});
			},
			{ threshold: 0 }
		);
		observer.observe(orbit);
		return { calculateRadius, updatePlanetPositions };
	}
	const orbits = document.querySelectorAll(".orbit");
	const orbitAnimations = [];
	for (let i = 0; i < orbits.length; i++) {
		orbitAnimations.push(createOrbitAnimation(orbits[i], 6, "50%", 30000));
	}
	window.addEventListener("resize", () => {
		for (let i = 0; i < orbitAnimations.length; i++) {
			const animation = orbitAnimations[i];
			if (animation) {
				animation.calculateRadius();
				animation.updatePlanetPositions(0);
			}
		}
	});

	/**
	 * Preloader
	 */
	const preloader = document.querySelector(".preloader");

	// Sync with the page loading process
	window.addEventListener("load", function () {
		if (preloader) {
			setTimeout(() => {
				preloader.style.display = "none";
			}, 300);
		}
	});

	/**
	 * Animation
	 */
	let mm = gsap.matchMedia();
	mm.add("(min-width: 992px)", () => {
		let smoother = ScrollSmoother.create({
			wrapper: "#smooth-wrapper",
			content: "#smooth-content",
			smooth: 1.5,
			effects: true,
			normalizeScroll: true,
			smoothTouch: 0.1,
		});

		document.querySelectorAll('[data-scroll]').forEach(link => {
			link.addEventListener('click', e => {
				e.preventDefault();

				const target = document.querySelector(link.dataset.scroll);
				if (!target) return;

				const navHeight = document.querySelector('.navbar')?.offsetHeight || 0

				smoother.scrollTo(target, true, `top+=${navHeight} top`);
			});
		});


		const folderCards = document.querySelectorAll(".folder-card-list li");

		if (folderCards.length) {
			gsap.utils.toArray(folderCards).forEach((card, i) => {
				gsap.to(card, {
					scrollTrigger: {
						trigger: card,
						start: "top top+=" + (120 + i * 40),
						pin: true,
						pinSpacing: i === folderCards.length - 1,
						scrub: true,
					},
				});
			});
		}

		function hero2() {
			let gsapFadeIn = gsap.utils.toArray(".gsap-fadeIn");
			let gsapReveal = gsap.utils.toArray(".gsap-reveal");
			let hero2Images = gsap.utils.toArray(".hero-2__images");
			let hero2Line1 = document.querySelector(".hero-2__line-1");
			let hero2Line2 = document.querySelector(".hero-2__line-2");
			let hero2Line3 = document.querySelector(".hero-2__line-3");
			let hero2Line4 = document.querySelector(".hero-2__line-4");
			if (!hero2Images || !hero2Line1 || !hero2Line2 || !hero2Line3 || !hero2Line4)
				return;
			let tl = gsap.timeline();
			for (let i = 0; i < gsapFadeIn.length; i++) {
				tl.from(gsapFadeIn[i], {
					opacity: 0,
					y: 50,
					duration: 1,
					stagger: 0.5,
				});
			}
			for (let i = 0; i < gsapReveal.length; i++) {
				tl.from(gsapReveal[i], {
					opacity: 0,
					duration: 1,
					stagger: 0.5,
				});
			}
			for (let i = 0; i < hero2Images.length; i++) {
				const item = hero2Images[i];
				const hero2FlipState = Flip.getState(item);
				const hero2FlipAnimation = Flip.to(hero2FlipState, {
					duration: 2,
					opacity: 0,
					ease: "power2.out",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					scale: true,
				});
				tl.add(hero2FlipAnimation, "group");
			}
			tl.from(
				hero2Line1,
				{ opacity: 0, duration: 0.25, stagger: 0.25 },
				"initLineTop"
			)
				.from(
					hero2Line2,
					{ opacity: 0, duration: 0.25, stagger: 0.25 },
					"initLineBottom"
				)
				.from(
					hero2Line3,
					{ opacity: 0, duration: 0.25, stagger: 0.25 },
					"initLineTop"
				)
				.from(hero2Line4, { opacity: 0, duration: 0.25, stagger: 0.25 });
		}

		function hero3() {
			const hero3 = document.querySelector(".hero-3");
			const hero3Alert = document.querySelector(".hero-3__alert");
			const hero3Title = gsap.utils.toArray(".hero-3__title");
			const hero3Description = gsap.utils.toArray(".hero-3__description");
			const hero3Btns = gsap.utils.toArray(".hero-3__btns");
			const hero3ImgOne = document.querySelector(".hero-3__img-1");
			const hero3ImgTwo = document.querySelector(".hero-3__img-2");
			const hero3ElementOne = document.querySelector(".hero-3__element-1");
			const hero3ElementTwo = document.querySelector(".hero-3__element-2");
			const hero3ElementThree = document.querySelector(".hero-3__element-3");
			const hero3ElementFour = document.querySelector(".hero-3__element-4");
			const hero3ElementFive = document.querySelector(".hero-3__element-5");
			const hero3ElementSix = document.querySelector(".hero-3__element-6");
			const hero3ElementSeven = document.querySelector(".hero-3__element-7");
			if (
				!hero3 ||
				!hero3Alert ||
				!hero3Title.length ||
				!hero3Description.length ||
				!hero3Btns.length ||
				!hero3ImgOne ||
				!hero3ImgTwo ||
				!hero3ElementOne ||
				!hero3ElementTwo ||
				!hero3ElementThree ||
				!hero3ElementFour ||
				!hero3ElementFive ||
				!hero3ElementSix ||
				!hero3ElementSeven
			)
				return;
			const tl = gsap.timeline();
			tl.from(hero3Alert, { opacity: 0, y: 24, duration: 1, delay: 1 });
			for (let i = 0; i < hero3Title.length; i++) {
				const item = hero3Title[i];
				const hero3TitleSplit = new SplitText(item, { type: "words" });
				tl.from(hero3TitleSplit.words, {
					opacity: 0,
					yPercent: 50,
					duration: 1,
					stagger: 0.05,
					ease: "back.out",
					onComplete: () => {
						hero3TitleSplit.revert();
					},
				});
			}
			for (let i = 0; i < hero3Description.length; i++) {
				const item = hero3Description[i];
				const hero3DescriptionSplit = new SplitText(item, { type: "words" });
				tl.from(
					hero3DescriptionSplit.words,
					{
						opacity: 0,
						yPercent: 50,
						duration: 1,
						stagger: 0.05,
						ease: "back.out",
						onComplete: () => {
							hero3DescriptionSplit.revert();
						},
					},
					"-=0.25"
				);
			}
			for (let i = 0; i < hero3Btns.length; i++) {
				tl.from(
					hero3Btns[i],
					{ opacity: 0, yPercent: 25, stagger: 0.05 },
					"-=0.25"
				);
			}
			tl.from(
				hero3ImgOne,
				{ opacity: 0, yPercent: 50, duration: 1, ease: "back.out" },
				"-=0.25"
			)
				.from(
					hero3ImgTwo,
					{ opacity: 0, yPercent: 50, duration: 1, ease: "back.out" },
					"-=0.25"
				)
				.from(
					hero3ElementOne,
					{ opacity: 0, duration: 1, ease: "back.out" },
					"-=0.5"
				)
				.from(
					hero3ElementTwo,
					{ opacity: 0, duration: 1, ease: "back.out" },
					"-=0.5"
				)
				.from(
					hero3ElementThree,
					{ opacity: 0, duration: 1, ease: "back.out" },
					"-=0.5"
				)
				.from(
					hero3ElementFour,
					{ opacity: 0, duration: 1, ease: "back.out" },
					"-=0.5"
				)
				.from(
					hero3ElementFive,
					{ opacity: 0, duration: 1, ease: "back.out" },
					"circleRing"
				)
				.from(
					hero3ElementSix,
					{ opacity: 0, duration: 1, ease: "back.out" },
					"circleRing"
				)
				.from(
					hero3ElementSeven,
					{ opacity: 0, duration: 1, ease: "back.out" },
					"-=0.5"
				);
		}

		function pathAnimationOn() {
			const paths = gsap.utils.toArray(".path-2");
			if (!paths.length) return;
			for (let i = 0; i < paths.length; i++) {
				const path = paths[i];
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: path,
						start: "clamp(top 90%)",
						end: "clamp(bottom 25%)",
						once: true,
					},
				});
				tl.from(path, { drawSVG: 0, duration: 2 });
			}
		}

		function pathAnimationTwo() {
			const paths = gsap.utils.toArray(".path-1");
			if (!paths.length) return;
			for (let i = 0; i < paths.length; i++) {
				const path = paths[i];
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: path,
						start: "clamp(top 90%)",
						end: "clamp(bottom 25%)",
						once: true,
					},
				});
				tl.from(path, { drawSVG: "100% 100%", duration: 2 });
			}
		}

		function textAnimation() {
			const items = gsap.utils.toArray(".gsap-text-animation");
			if (!items.length) return;
			for (let i = 0; i < items.length; i++) {
				const item = items[i];
				const scrollTriggerSupport = item.dataset.scrollTrigger;
				const animationStart = item.dataset.start || "90%";
				const animationEnd = item.dataset.end || "25%";
				const animationStagger = item.dataset.stagger || "0.05";
				const animationDuration = item.dataset.duration || "1";
				const animationDelay = item.dataset.delay || "0";
				const animationY = item.dataset.y || "50";
				const animationOpacity = item.dataset.opacity || "0";
				const splitType = item.dataset.splitType || "chars";
				const scrollMarker = item.dataset.marker || false;
				const textSplit = new SplitText(item, { type: splitType });
				let itemsToAnimate;
				if (splitType === "chars") {
					itemsToAnimate = textSplit.chars;
				} else if (splitType === "words") {
					itemsToAnimate = textSplit.words;
				} else if (splitType === "lines") {
					itemsToAnimate = textSplit.lines;
				} else {
					console.error("Invalid split type:", splitType);
					continue;
				}
				if (!itemsToAnimate.length) {
					textSplit.revert();
					continue;
				}
				const tl = scrollTriggerSupport
					? gsap.timeline({
							scrollTrigger: {
								trigger: item,
								start: `clamp(top ${animationStart})`,
								end: `clamp(bottom ${animationEnd})`,
								markers: scrollMarker,
								once: true,
							},
					  })
					: gsap.timeline();
				tl.from(itemsToAnimate, {
					opacity: parseFloat(animationOpacity),
					delay: parseFloat(animationDelay),
					yPercent: parseFloat(animationY),
					duration: parseFloat(animationDuration),
					stagger: parseFloat(animationStagger),
					ease: "back.out",
					onComplete: () => {
						textSplit.revert();
					},
				});
			}
		}

		function imageRevealAnimation() {
			const imageContainers = gsap.utils.toArray(".gsap-image-reveal");
			if (!imageContainers.length) return;
			for (let i = 0; i < imageContainers.length; i++) {
				const image = imageContainers[i];
				const revealImage = image.querySelector("img");
				if (!revealImage) continue;
				const scrollTriggerSupport = image.dataset.scrollTrigger;
				const animationStart = image.dataset.start || "90%";
				const animationEnd = image.dataset.end || "25%";
				const scrollMarker = image.dataset.marker || false;
				const tl = scrollTriggerSupport
					? gsap.timeline({
							scrollTrigger: {
								trigger: image,
								start: `clamp(top ${animationStart})`,
								end: `clamp(bottom ${animationEnd})`,
								markers: scrollMarker,
								once: true,
							},
					  })
					: gsap.timeline();
				tl.set(image, { autoAlpha: 1 });
				tl.from(image, { xPercent: -100, duration: 1.5, ease: "power2.out" });
				tl.from(revealImage, {
					xPercent: 100,
					ease: "power2.out",
					scale: 1.5,
					duration: 1.5,
					delay: -1.5,
				});
			}
		}

		function fadeInAnimation() {
			const fadeIn = gsap.utils.toArray(".gsap-fade-in");
			if (!fadeIn.length) return;
			for (let i = 0; i < fadeIn.length; i++) {
				const item = fadeIn[i];
				const scrollTriggerSupport = item.dataset.scrollTrigger;
				const animationStart = item.dataset.start || "90%";
				const animationEnd = item.dataset.end || "25%";
				const animationStagger = item.dataset.stagger || "0";
				const animationDuration = item.dataset.duration || "1";
				const animationDelay = item.dataset.delay || "0";
				const animationY = item.dataset.y || "0";
				const animationX = item.dataset.x || "0";
				const animationOpacity = item.dataset.opacity || "0";
				const scrollMarker = item.dataset.marker || false;
				const tl = scrollTriggerSupport
					? gsap.timeline({
							scrollTrigger: {
								trigger: item,
								start: `clamp(top ${animationStart})`,
								end: `clamp(bottom ${animationEnd})`,
								markers: scrollMarker,
								once: true,
							},
					  })
					: gsap.timeline();
				tl.from(item, {
					opacity: parseFloat(animationOpacity),
					yPercent: parseFloat(animationY),
					xPercent: parseFloat(animationX),
					delay: parseFloat(animationDelay),
					stagger: parseFloat(animationStagger),
					duration: parseFloat(animationDuration),
					ease: "back.out",
				});
			}
		}

		function zoomAnimation() {
			const zoomAnimation = gsap.utils.toArray(".gsap-zoom");
			if (!zoomAnimation.length) return;
			for (let i = 0; i < zoomAnimation.length; i++) {
				const item = zoomAnimation[i];
				const scrollTriggerSupport = item.dataset.scrollTrigger;
				const animationStart = item.dataset.start || "90%";
				const animationEnd = item.dataset.end || "25%";
				const animationOpacity = item.dataset.opacity || "1";
				const animationScale = item.dataset.scale || "1";
				const animationScrub = item.dataset.scrub || false;
				const tl = scrollTriggerSupport
					? gsap.timeline({
							scrollTrigger: {
								trigger: item,
								start: `clamp(top ${animationStart})`,
								end: `clamp(bottom ${animationEnd})`,
								scrub: parseFloat(animationScrub),
								once: true,
							},
					  })
					: gsap.timeline();
				tl.from(item, {
					opacity: parseFloat(animationOpacity),
					scale: parseFloat(animationScale),
				});
			}
		}

		function imgFlip() {
			const imgFlip = gsap.utils.toArray(".gsap-img-flip");
			if (!imgFlip.length) return;
			for (let i = 0; i < imgFlip.length; i++) {
				const item = imgFlip[i];
				const imgFlipState = Flip.getState(item);
				const scrollTriggerSupport = item.dataset.scrollTrigger;
				const animationStart = item.dataset.start || "90%";
				const animationEnd = item.dataset.end || "25%";
				const animationScrub = item.dataset.scrub || false;
				const flipAnimation = Flip.to(imgFlipState, {
					duration: 2,
					opacity: 0,
					ease: "power2.out",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					scale: true,
				});
				const tl = scrollTriggerSupport
					? gsap.timeline({
							scrollTrigger: {
								trigger: item,
								start: `clamp(top ${animationStart})`,
								end: `clamp(bottom ${animationEnd})`,
								scrub: parseFloat(animationScrub),
								once: true,
							},
					  })
					: gsap.timeline();
				tl.add(flipAnimation, "group");
			}
		}

		pathAnimationOn();
		pathAnimationTwo();
		imageRevealAnimation();
		fadeInAnimation();
		zoomAnimation();
		imgFlip();

		document.fonts.ready
			.then(() => {
				hero2();
				hero3();
				textAnimation();
			})
			.catch((error) => {
				console.error("Font loading failed:", error);
				hero2();
				hero3();
				textAnimation();
			});
	});
});
