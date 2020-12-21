const svgAsImg = (icon: string, size = 16): HTMLImageElement => {
  const image = new Image(size, size)
  image.src = `data:image/svg+xml;charset=utf-8;base64,${btoa(icon)}`
  return image
}

export default svgAsImg
