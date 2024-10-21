import { FileUploadDemo } from "@/components/blocks/image-upload";
import { UrlUpload } from "@/components/blocks/url-upload";
import Cloudinary1 from "@/components/test/cloudinary1";
import { Button, buttonStyles, Link } from "@/components/ui";
import { FileUpload } from "@/components/upload";

export default function Home() {
  return (
    <section className="bg-inherit">
      <div>hola</div>
      <Link href="/chat">
        <Button>Chat</Button>
      </Link>
      <Cloudinary1 />
      <UrlUpload />
    </section>
  );
}
