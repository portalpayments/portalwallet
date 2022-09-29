<svg
  role="img"
  width="300"
  height="120"
  aria-labelledby="loading-aria"
  viewBox="0 0 440 180"
  preserveAspectRatio="none"

>
  
  <title id="loading-aria">Loading...</title>
  <rect
    x="0"
    y="0"
    width="100%"
    height="100%"
    clip-path="url(#clip-path)"
    style='fill: url("#fill");'
  ></rect>
  <defs>
    <clipPath id="clip-path">
        <circle cx="180" cy="70" r="28" />
        <rect x="220" y="45" rx="5" ry="10" width="30" height="50" />
        <circle cx="260" cy="87" r="6" />
        <rect x="270" y="62" rx="5" ry="10" width="24" height="33" />
     
    </clipPath>
    <linearGradient id="fill">
      <stop
        offset="0.599964"
        stop-color="#d9d9d9"
        stop-opacity="1"
      >
        <animate
          attributeName="offset"
          values="-2; -2; 1"
          keyTimes="0; 0.25; 1"
          dur="2s"
          repeatCount="indefinite"
        ></animate>
      </stop>
      <stop
        offset="1.59996"
        stop-color="#ededed"
        stop-opacity="1"
      >
        <animate
          attributeName="offset"
          values="-1; -1; 2"
          keyTimes="0; 0.25; 1"
          dur="2s"
          repeatCount="indefinite"
        ></animate>
      </stop>
      <stop
        offset="2.59996"
        stop-color="#d9d9d9"
        stop-opacity="1"
      >
        <animate
          attributeName="offset"
          values="0; 0; 3"
          keyTimes="0; 0.25; 1"
          dur="2s"
          repeatCount="indefinite"
        ></animate>
      </stop>
    </linearGradient>
  </defs>
</svg>