export function randomString(len: number) {
  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let value = ""
  for (let i = 0; i < len; i++) {
      const randomPos = Math.floor(Math.random() * charSet.length);
      value += charSet.substring(randomPos,randomPos+1);
  }
  return value;
}