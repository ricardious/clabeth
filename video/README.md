# Video promocional de Clabeth

El proyecto incluye una pieza de 30 segundos creada con Remotion y una versión
vertical para redes. Todo el movimiento, las interfaces y las transiciones se
renderizan desde React; no depende de capturas externas.

```sh
pnpm video                   # abrir Remotion Studio
pnpm video:render            # 1920 × 1080, MP4
pnpm video:render:vertical   # 1080 × 1920, MP4
pnpm video:still             # portada 1920 × 1080
```

Los archivos exportados se guardan en `out/` y no se incluyen en Git. El texto
principal, el llamado a la acción y la firma de producto se pueden modificar
desde `DEFAULT_PROMO_PROPS` en `video/types.ts`.

La pieza recorre seis momentos: Markdown transformándose en papel, editor en
vivo, fórmulas, personalización, exportación y cierre. Las transiciones combinan
barridos de papel, desplazamientos con resorte y una línea de tinta roja.
