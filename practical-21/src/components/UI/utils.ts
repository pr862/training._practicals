export const cx = (...classes: (string | false | null | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};