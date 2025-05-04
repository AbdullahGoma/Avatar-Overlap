document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".avatars-container");
  const avatars = document.querySelector(".avatars");
  const avatarContainers = document.querySelectorAll(".avatar-container");

  let scrollInterval;
  let scrollSpeed = 15;
  let isScrolling = false;

  // Function to center the hovered avatar
  function centerHoveredAvatar(avatar) {
    const containerRect = container.getBoundingClientRect();
    const avatarRect = avatar.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    const avatarCenter = avatarRect.left + avatarRect.width / 2;

    // Calculate the scroll position needed to center the avatar
    const scrollAmount = avatarCenter - containerCenter;

    // Smoothly scroll to center the avatar
    container.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  }

  // Add hover event to each avatar
  avatarContainers.forEach((avatar) => {
    avatar.addEventListener("mouseenter", function () {
      centerHoveredAvatar(this);
    });
  });

  // Function to handle edge detection and scrolling
  function handleEdgeScroll(e) {
    if (isScrolling) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const edgeThreshold = 50; // pixels from edge to trigger scroll

    // Clear any existing interval
    clearInterval(scrollInterval);

    // Left edge
    if (x < edgeThreshold) {
      isScrolling = true;
      scrollInterval = setInterval(() => {
        container.scrollLeft -= scrollSpeed;
      }, 20);
    }
    // Right edge
    else if (x > rect.width - edgeThreshold) {
      isScrolling = true;
      scrollInterval = setInterval(() => {
        container.scrollLeft += scrollSpeed;
      }, 20);
    }
  }

  // Stop scrolling
  function stopScroll() {
    isScrolling = false;
    clearInterval(scrollInterval);
  }

  // Event listeners
  container.addEventListener("mousemove", handleEdgeScroll);
  container.addEventListener("mouseleave", stopScroll);
  container.addEventListener("mouseup", stopScroll);

  // Make it work on touch devices too
  container.addEventListener("touchmove", function (e) {
    const touch = e.touches[0];
    const fakeMouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    handleEdgeScroll(fakeMouseEvent);
  });

  container.addEventListener("touchend", stopScroll);
});

document.querySelectorAll(".avatar-container").forEach((el, index, arr) => {
  // Set initial z-index based on the order
  el.style.zIndex = arr.length - index;

  el.addEventListener("mouseenter", () => {
    // Prevent the z-index update while hovering
    el.style.zIndex = 100; // Optionally set to a very high value when hovering
  });

  el.addEventListener("mouseleave", () => {
    // Restore the original z-index after hover ends
    el.style.zIndex = arr.length - index;
  });
});
