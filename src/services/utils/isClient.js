const isClient = () => typeof window !== "undefined" && window !== null;
export default isClient;
