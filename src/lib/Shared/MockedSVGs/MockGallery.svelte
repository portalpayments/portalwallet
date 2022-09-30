<svg
  role="img"
  width="300"
  height="400"
  aria-labelledby="loading-aria"
  viewBox="2000 200 500 500"
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
    <rect x="32" y="8" rx="15" ry="15" width="211" height="211" />
    <rect x="260" y="8" rx="15" ry="15" width="211" height="211" />
    <rect x="32" y="233" rx="15" ry="15" width="211" height="211" />
    <rect x="260" y="233" rx="15" ry="15" width="211" height="211" />  
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