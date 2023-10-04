import { Element } from "@mod-protocol/core";

const upload: Element[] = [
  {
    type: "vertical-layout",
    onload: {
      ref: "myFileUploadRequest",
      type: "POST",
      url: "{{api}}/infura-ipfs-upload",
      body: {
        formData: {
          file: {
            type: "blobRef",
            value: "refs.myOpenFileAction.files[0].blob",
          },
        },
      },
      onsuccess: {
        type: "ADDEMBED",
        url: "{{refs.myFileUploadRequest.response.data.url}}",
        name: "{{refs.myOpenFileAction.files[0].name}}",
        mimeType: "{{refs.myOpenFileAction.files[0].mimeType}}",
        onsuccess: {
          type: "EXIT",
        },
      },
      onerror: "#error",
      onloading: "#loading",
    },
  },
];

export default upload;
