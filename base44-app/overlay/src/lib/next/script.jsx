/** Erstatning for next/script: indlæser et eksternt script asynkront. */
export default function Script({ src }) {
  return src ? <script src={src} async /> : null;
}
