<script lang="ts">
  import qrcode from "qrcode";
  import { log } from "../../backend/functions";

  export let walletAddress: string;

  const qrCodeImage: HTMLElement | null = null;

  const getQRcodeImage = async (string: String) => {
    let canvas = await qrcode.toCanvas(string);
    try {
      let canvas = await qrcode.toCanvas(`my sample text`);

      // Add a logo at center
      const imageDimensions = { width: 30, height: 30 };
      var context = canvas.getContext("2d");
      var image = new Image();
      image.src = "./images/logo.png";
      image.onload = function () {
        context.drawImage(
          image,
          canvas.width / 2 - imageDimensions.width / 2,
          canvas.height / 2 - imageDimensions.height / 2,
          imageDimensions.width,
          imageDimensions.height
        );
      };
    } catch (thrownObject) {
      const error = thrownObject as Error;
      log(`Error making canvas`, thrownObject.error);
    }
    return canvas;
  };

  getQRcodeImage(walletAddress);
</script>

<div>
  {qrCodeImage}
</div>
