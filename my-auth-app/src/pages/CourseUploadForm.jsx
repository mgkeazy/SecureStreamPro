import React , { useState, useEffect  } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";

export default function CourseUploadForm() {
  console.log(import.meta.env.VITE_CLOUD_NAME)
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [videos, setVideos] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      benefits: [{ title: "" }],
      prerequisites: [{ title: "" }],
      courseData: [
        {
          title: "",
          videoUrl: "",
          videoSection: "",
          description: "",
          videoLength: 0,
          videoPlayer: "",
          suggestion: "",
          links: [{ title: "", url: "" }],
        },
      ],
    },
  });

  const {
    fields: benefitFields,
    append: appendBenefit,
    remove: removeBenefit,
  } = useFieldArray({ control, name: "benefits" });

  const {
    fields: prereqFields,
    append: appendPrerequisite,
    remove: removePrerequisite,
  } = useFieldArray({ control, name: "prerequisites" });

  const {
    fields: courseFields,
    append: appendCourseData,
    remove: removeCourseData,
  } = useFieldArray({ control, name: "courseData" });

  const onSubmit = async (data) => {
    console.log(data);
  };

  const watchCourseData = watch("courseData");

  // const handleFileChange = async (e, index) => {
  //   // setVideos([...videos, e.target.files[0]]);

  //   const file=e.target.files[0];
  //   if (!file) return alert('Choose a file first');

  //   // 1️⃣ Step 1: Request upload credentials
  //   const title = encodeURIComponent(file.name);
  //   const credRes = await axios.put(
  //     'http://localhost:8000/api/v1/getCredentials',
  //     { title },{
  //       withCredentials:true
  //     }
  //   );
  //   console.log(credRes)
  //   const { clientPayload, videoId } = credRes.data;

  //   // 2️⃣ Step 2: Actually upload the file
  //   const form = new FormData();
  //   // pass the server‐returned payload (stringify if needed)
  //   form.append('clientPayload', JSON.stringify(clientPayload));
  //   form.append('videoId', videoId);
  //   form.append('file', file);

  //   console.log(credRes);

  //   const uploadRes = await axios.post(
  //     'http://localhost:8000/api/v1/upload-vdo-cipher',
  //     form,
  //     { headers: { 'Content-Type': 'multipart/form-data' } }
  //   );
  //   // 3️⃣ Notify parent when done
  //   onUploaded(uploadRes.data.videoId);
  //   console.log(uploadRes.data.videoId);
  //   const vdoCipherId = uploadRes.data.videoId;

  //   setValue(`courseData.${index}.videoUrl`, "chuttad", {
  //     shouldValidate: true,
  //     shouldDirty: true,
  //   });
  //   // console.log(courseFields[index].videoUrl);
  // };

  const handleImageUpload = async (file) => {
    setUploading(true);

    // Assuming you're using Cloudinary to upload the image.
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_upload_preset"); // Replace with your actual preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
        formData
      );

      const { public_id, secure_url } = response.data;

      // Create the thumbnail object
      const thumbnailObj = {
        public_id: public_id,
        url: secure_url,
      };

      // Update React Hook Form and local state with the thumbnail object
      setThumbnail(thumbnailObj); // This is for display purposes

    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  // UseEffect to update React Hook Form when thumbnail is set
  useEffect(() => {
    if (thumbnail) {
      setValue("thumbnail", thumbnail); // Set the thumbnail value in the form state
    }
  }, [thumbnail, setValue]); // Runs when thumbnail changes

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 space-y-4 max-w-2xl mx-auto bg-white rounded-lg shadow-md mt-24 sm:p-6 md:p-8 lg:p-10 xl:p-12"
    >
      <h2 className="text-2xl font-bold text-center mb-4">Course Details</h2>
      
      <input
        {...register("name", { required: "Course name is required" })}
        placeholder="Course Name"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      {errors.name && <p className="text-sm text-red-600 mb-2">{errors.name.message}</p>}

      <textarea
        {...register("description", { required: "Description is required" })}
        placeholder="Description"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      {errors.description && <p className="text-sm text-red-600 mb-2">{errors.description.message}</p>}

      <input
        {...register("categories", { required: "Categories are required" })}
        placeholder="Categories"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      {errors.categories && <p className="text-sm text-red-600 mb-2">{errors.categories.message}</p>}

      <input
        {...register("tags", { required: "Tags are required" })}
        placeholder="Tags"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      {errors.tags && <p className="text-sm text-red-600 mb-2">{errors.tags.message}</p>}

      <input
        {...register("level", { required: "Level is required" })}
        placeholder="Level"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      {errors.level && <p className="text-sm text-red-600 mb-2">{errors.level.message}</p>}

      <input
        type="number"
        {...register("price", { required: "Price is required" })}
        placeholder="Price"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      {errors.price && <p className="text-sm text-red-600 mb-2">{errors.price.message}</p>}

      <input
        type="number"
        {...register("estimatedPrice")}
        placeholder="Estimated Price"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />

      <input
        {...register("demoUrl", { required: "Demo URL is required" })}
        placeholder="Demo URL"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      {errors.demoUrl && <p className="text-sm text-red-600 mb-2">{errors.demoUrl.message}</p>}

      {/* Thumbanil */}
      <h3 className="text-lg font-semibold mt-4">Thumbnail</h3>
      <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 mb-3 rounded inline-block">
        Upload Image
        <input
          type="file"
          accept="image/*"
          {...register("image")}
          onChange={(e)=> handleImageUpload(e.target.files[0])}
          className="hidden"
          disabled={uploading}
        />
      </label>
      {uploading && <p>Uploading...</p>}
      {/* <input
        type="text"
        {...register("thumbnail.public_id", { required: "Thumbnail public ID is required" })}
        placeholder="Thumbnail Public ID"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      /> */}
      {/* {errors.thumbnail?.public_id && <p className="text-sm text-red-600 mb-2">{errors.thumbnail.public_id.message}</p>} */}


      {/* <input
        type="text"
        {...register("thumbnail.url", { required: "Thumbnail URL is required" })}
        placeholder="Thumbnail URL"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      {errors.thumbnail?.url && <p className="text-sm text-red-600 mb-2">{errors.thumbnail.url.message}</p>} */}

      <h3 className="text-lg font-semibold mt-4">Benefits</h3>
      {benefitFields.map((item, index) => (
        <div key={item.id} className="flex items-center mb-2">
          <input
            {...register(`benefits.${index}.title`, { required: "Benefit is required" })}
            placeholder="Benefit"
            className="w-full p-2 border border-gray-300 rounded mr-2"
          />
          <button type="button" onClick={() => removeBenefit(index)} className="bg-red-500 text-white px-2 py-1 rounded">
            Remove
          </button>
        </div>
      ))}

      <button type="button" onClick={() => appendBenefit({ title: "" })} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Add Benefit
      </button>

      <h3 className="text-lg font-semibold mt-4">Prerequisites</h3>
      {prereqFields.map((item, index) => (
        <div key={item.id} className="flex items-center mb-2">
          <input
            {...register(`prerequisites.${index}.title`, { required: "Prerequisite is required" })}
            placeholder="Prerequisite"
            className="w-full p-2 border border-gray-300 rounded mr-2"
          />
          <button type="button" onClick={() => removePrerequisite(index)} className="bg-red-500 text-white px-2 py-1 rounded">
            Remove
          </button>
        </div>
      ))}

      <button type="button" onClick={() => appendPrerequisite({ title: "" })} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        Add Prerequisite
      </button>


      {/* Course Content */}

      <h3 className="text-lg font-semibold mt-4">Course Content</h3>
      {courseFields.map((item, index) => (
        
        <div key={item.id} className="border p-4 mb-4 rounded-lg">

          <input {...register(`courseData.${index}.title`)} placeholder="Video Title" className="w-full p-2 border border-gray-300 rounded mb-2" />

          {/* <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 mb-3 rounded inline-block">
            Upload Video
            <input
              type="file"
              {...register(`courseData.${index}.uploadVideo`)}
              onChange={(e) => handleFileChange(e,index)}
              className="hidden"
              accept="video/*"
            />
          </label> */}

          {/* { watchCourseData[index]?.uploadVideo ? (
            
            ):(null) } */}
          <input  {...register(`courseData.${index}.videoUrl`)} placeholder="Video URL" className="w-full p-2 border border-gray-300 rounded mb-2" />

          <input {...register(`courseData.${index}.videoSection`)} placeholder="Video Section" className="w-full p-2 border border-gray-300 rounded mb-2" />

          <textarea {...register(`courseData.${index}.description`)} placeholder="Description" className="w-full p-2 border border-gray-300 rounded mb-2" />
          <input type="number" {...register(`courseData.${index}.videoLength`)} placeholder="Length (s)" className="w-full p-2 border border-gray-300 rounded mb-2" />
          <input {...register(`courseData.${index}.videoPlayer`)} placeholder="Video Player" className="w-full p-2 border border-gray-300 rounded mb-2" />
          <input {...register(`courseData.${index}.suggestion`)} placeholder="Suggestion" className="w-full p-2 border border-gray-300 rounded mb-2" />

          <h4 className="text-md font-medium mt-2">Links</h4>
          <input {...register(`courseData.${index}.links.0.title`)} placeholder="Link Title" className="w-full p-2 border border-gray-300 rounded mb-2" />
          <input {...register(`courseData.${index}.links.0.url`)} placeholder="Link URL" className="w-full p-2 border border-gray-300 rounded mb-2" />

          <button type="button" onClick={() => removeCourseData(index)} className="bg-red-500 text-white px-2 py-1 rounded mt-2">
            Remove Video
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          appendCourseData({
            title: "",
            videoUrl: "",
            videoSection: "",
            description: "",
            videoLength: 0,
            videoPlayer: "",
            suggestion: "",
            links: [{ title: "", url: "" }],
          })
        }
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Video
      </button>

      <button type="submit" className="bg-green-500 text-white px-6 py-3 rounded-full w-full">
        Submit Course
      </button>
    </form>
  );
}
