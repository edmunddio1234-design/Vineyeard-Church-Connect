export default function VineyardLogo({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Grapevine with leaves */}
      <circle cx="7" cy="6" r="2.5" fill="#6B46C1" />
      <circle cx="12" cy="4" r="2.5" fill="#6B46C1" />
      <circle cx="17" cy="6" r="2.5" fill="#6B46C1" />
      <circle cx="9" cy="10" r="2.5" fill="#6B46C1" />
      <circle cx="15" cy="10" r="2.5" fill="#6B46C1" />
      <circle cx="7" cy="14" r="2.5" fill="#9F7AEA" />
      <circle cx="12" cy="16" r="2.5" fill="#9F7AEA" />
      <circle cx="17" cy="14" r="2.5" fill="#9F7AEA" />

      {/* Connecting vine lines */}
      <path
        d="M 7 8.5 Q 9.5 9 12 8"
        stroke="#553C9A"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M 12 6.5 Q 14.5 8 17 8.5"
        stroke="#553C9A"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M 7 8.5 Q 8 9.5 9 10"
        stroke="#553C9A"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M 17 8.5 Q 16 9.5 15 10"
        stroke="#553C9A"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M 9 12.5 Q 10.5 13 12 14"
        stroke="#553C9A"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M 15 12.5 Q 13.5 13 12 14"
        stroke="#553C9A"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M 12 14 Q 12 15 12 16"
        stroke="#553C9A"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Left leaf */}
      <path
        d="M 5 5 Q 4 4 3.5 2"
        stroke="#6B46C1"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M 5 5 Q 3.5 5 2.5 4"
        stroke="#6B46C1"
        strokeWidth="1"
        fill="none"
      />

      {/* Right leaf */}
      <path
        d="M 19 5 Q 20 4 20.5 2"
        stroke="#6B46C1"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M 19 5 Q 20.5 5 21.5 4"
        stroke="#6B46C1"
        strokeWidth="1"
        fill="none"
      />

      {/* Bottom leaf */}
      <path
        d="M 12 18 Q 11 20 10 21"
        stroke="#9F7AEA"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M 12 18 Q 13 20 14 21"
        stroke="#9F7AEA"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}
