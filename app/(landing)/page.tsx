"use client"; ///Borrar esta línea
import { UrlUpload } from "@/components/blocks/url-upload";
import UploadResultsTable from "@/components/blocks/results";
// import Cloudinary1 from "@/components/test/cloudinary1";
import { Button, Link } from "@/components/ui";
import { toast } from "sonner";
// import { ViewImage } from "@/components/blocks/view-images";

export default function Home() {
  const handleViewLocalStorage = () => {
    const uploadResults = JSON.parse(
      localStorage.getItem("uploadResults") || "[]"
    );
    console.log(uploadResults);
  };
  return (
    <section className="bg-inherit">
      <div className="p-4 bg-overlay">hola</div>
      <Link href="/chat">
        <Button>Chat</Button>
      </Link>
      <Button
        appearance="outline"
        onPress={() => toast.success("The registration was successful.")}
      >
        Success
      </Button>
      <Button onPress={handleViewLocalStorage}>Ver Local Storage</Button>
      {/* <ViewImage /> */}
      <UploadResultsTable />
      {/* <Cloudinary1 /> */}
      <UrlUpload />
    </section>
  );
}
