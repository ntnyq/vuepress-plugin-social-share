/**
 * @file Constants
 */

export const RE_SVG_SOURCE = /<svg (.*?)>(.*?)<\/svg>/i
export const RE_EXTERNAL_LINK = /^(https?:|mailto:|tel:|[a-zA-Z]{4,}:)/
export const RE_EMAIL = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/

export const SVG_ICON_CLOSE = `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <path d="M657.44 512l266.72-266.72A102.88 102.88 0 00778.72 99.84L512 366.56 245.28 99.84A102.88 102.88 0 1099.84 245.28L366.56 512 99.84 778.72a102.88 102.88 0 00145.44 145.44L512 657.44l266.72 266.72a102.88 102.88 0 00145.44-145.44L657.44 512z" />
</svg>
`
export const SVG_ICON_SHARE = `<svg viewBox="0 0 1040 1024" xmlns="http://www.w3.org/2000/svg">
  <path d="M823.506 631.474c0-7.192-3.783-12.397-11.352-15.71-6.816-2.838-13.154-1.419-18.925 4.352-9.37 8.612-19.116 15.33-29.24 19.968-6.529 3.594-9.745 8.801-9.745 15.71V771.53c0 23.753-8.516 44.195-25.455 61.132-16.938 16.936-37.283 25.455-61.132 25.455H217.765c-23.753 0-44.195-8.517-61.131-25.455-16.937-16.939-25.455-37.284-25.455-61.132V321.639c0-23.753 8.516-44.195 25.455-61.132s37.283-25.455 61.131-25.455h60.565c2.175 0 5.016-.757 8.612-2.174 20.156-12.304 44.195-23.091 71.921-32.459 9.37-1.799 14.1-7.57 14.1-17.317 0-4.734-1.703-8.708-5.108-12.208-3.407-3.407-7.476-5.108-12.208-5.108h-137.88c-42.87 0-79.588 15.235-110.06 45.707S62 278.683 62 321.553V771.54c0 42.87 15.234 79.588 45.707 110.06s67.19 45.707 110.06 45.707H667.66c42.87 0 79.589-15.234 110.06-45.707 30.472-30.473 45.708-67.19 45.708-110.06l.095-140.06-.016-.006zm138.454-292.52c0-9.369-3.408-17.506-10.315-24.32L744.016 107.005c-6.815-6.815-14.953-10.315-24.32-10.315-4.353 0-8.802.945-13.535 2.745-14.1 6.15-21.106 16.75-21.106 31.891v103.812h-86.497c-38.235 0-73.625 1.986-106.273 5.962-32.648 3.976-61.42 9.465-86.215 16.468-24.887 7.004-47.315 15.805-67.282 26.214-19.967 10.41-37 21.576-51.104 33.217-14.103 11.64-26.403 25.077-37 40.03-10.598 14.953-19.117 29.62-25.456 44.097-6.34 14.387-11.352 30.285-15.142 47.604-3.783 17.317-6.341 33.5-7.571 48.64-1.229 15.143-1.893 31.514-1.893 49.212 0 20.157 3.125 42.208 9.465 65.959 6.34 23.753 13.25 44.384 20.818 61.608 7.571 17.317 16.468 35.207 26.784 53.848 10.315 18.55 17.413 30.945 21.387 37.001 3.977 6.15 7.76 11.736 11.353 16.75 3.595 4.733 8.327 7.004 14.1 7.004 1.42 0 3.595-.381 6.529-1.042 8.327-3.977 11.925-10.126 10.787-18.358-16.184-121.134-2.838-206.4 40.03-255.797 41.452-47.222 120.376-70.88 236.868-70.88h86.497v103.81c0 15.143 7.004 25.742 21.106 31.892 4.734 1.799 9.18 2.745 13.534 2.745 9.745 0 17.887-3.408 24.321-10.316L951.83 363.178c6.716-6.815 10.126-14.858 10.126-24.227l.004.004z" />
</svg>`
