export const dynamicStyles = (base, addons) => {
  return `${base} ${addons.map((addon) => {
    return addon
  })}`;
};