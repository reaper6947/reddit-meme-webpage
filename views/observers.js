const images = document.querySelectorAll("[data-src]");
function preloadImage(img) {
  const src = img.getAttribute("data-src");
  if (!src) {return;}
  img.src = src;
}

const imgOptions = {
  threshold: 0,
  rootMargin: "0px 300px 500px 0px"
};
const imgObserver = new IntersectionObserver((entries, imgObserver) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) { return; }
    else {
      preloadImage(entry.target);
      imgObserver.unobserve(entry.target);  
    }
  });
}, imgOptions);

images.forEach((image) => {
  imgObserver.observe(image);
});
/*
<script>
    document.addEventListener("DOMContentLoaded", function () {
      const imageObserver = new IntersectionObserver((entries, imgObserver) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0) {
            const lazyImage = entry.target
            console.log("lazy loading ", lazyImage);
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.remove("lzy_img");
            imgObserver.unobserve(lazyImage);
          }
        });
      });
      const arr = document.querySelectorAll('img.lzy_img');
      arr.forEach((v) => {
        imageObserver.observe(v);
      });
    });
  </script>
  */