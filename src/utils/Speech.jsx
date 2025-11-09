export const speak = (text, lang = "en") => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 1;
  speechSynthesis.cancel(); // stop previous voice
  speechSynthesis.speak(utterance);
};
