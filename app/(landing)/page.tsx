"use client"; ///Borrar esta línea
import { UrlUpload } from "@/components/blocks/url-upload";
import UploadResultsTable from "@/components/blocks/results";
// import Cloudinary1 from "@/components/test/cloudinary1";
import { Button, Link } from "@/components/ui";

export default function Home() {
  const handleViewLocalStorage = () => {
    const uploadResults = JSON.parse(localStorage.getItem('uploadResults') || '[]');
    console.log(uploadResults);
  };
  return (
    <section className="bg-inherit">
      <div>hola</div>
      <Link href="/chat">
        <Button>Chat</Button>
      </Link>
      <Button onPress={handleViewLocalStorage}>Ver Local Storage</Button>
      <UploadResultsTable />
      {/* <Cloudinary1 /> */}
      <UrlUpload />
    </section>
  );
}
