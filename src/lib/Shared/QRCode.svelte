<script lang="ts">
  // https://stackoverflow.com/questions/53898890/how-to-generate-qr-code-together-with-the-image-in-a-center
  import qrcode from "qrcode";
  import { log } from "../../backend/functions";

  export let walletAddress: string;

  const LOGO_IMAGE = "/icon512-for-qr-codes.png"; //

  const QR_CODE_SIZE = 270;
  const LOGO_SIZE = 72;

  // https://stackoverflow.com/questions/73300193/svelte-reactive-value-with-typescript-type
  let qrCodeHTMLCanvasElement: HTMLCanvasElement | null;
  $: qrCodeHTMLCanvasElement = null;

  const getQRcodeImage = async (string: String): Promise<HTMLCanvasElement> => {
    log(`Generating QRcode for ${string}`);
    let canvas: HTMLCanvasElement;
    try {
      // See https://www.npmjs.com/package/qrcode#options
      canvas = await qrcode.toCanvas(string, {
        width: QR_CODE_SIZE,
        height: QR_CODE_SIZE,
        margin: 0,
      });

      log(canvas.constructor.name);

      // Add a logo at center
      const logoDimensions = { width: LOGO_SIZE, height: LOGO_SIZE };
      var context = canvas.getContext("2d");
      var image = new Image();
      image.src = LOGO_IMAGE;
      image.onload = function () {
        context.drawImage(
          image,
          canvas.width / 2 - logoDimensions.width / 2,
          canvas.height / 2 - logoDimensions.height / 2,
          logoDimensions.width,
          logoDimensions.height
        );
      };
    } catch (thrownObject) {
      const error = thrownObject as Error;
      log(`Error making canvas`, error.message);
    }
    return canvas;
  };
  (async () => {
    qrCodeHTMLCanvasElement = await getQRcodeImage(walletAddress);
    // TODO: for some reason {@html qrCodeHTMLCanvasElement ? qrCodeHTMLCanvasElement.outerHTML : ""}
    // does not work - so we use some generic JS instead of Svelte
    const element = document.querySelector(".qrcode-background");
    element.appendChild(qrCodeHTMLCanvasElement);
  })();
</script>

<div class="qrcode-background" />

<style>
</style>
