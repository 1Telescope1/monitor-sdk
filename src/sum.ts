export default function sum(...args: number[]): number {
  return args.reduce((prev, total) => total + prev, 0)
}
