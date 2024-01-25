"use client";
import React, { memo, useState, useEffect } from "react";
import { useSWRConfig } from "swr";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import Swal, { SweetAlertIcon } from "sweetalert2";
import "../styles/Swal.toasts.css";

const DialogDefault = ({
  showModal,
  setShowModal,
  buttonType,
  blog,
  setBlog,
}: {
  showModal: boolean;
  setShowModal: (setShowModal: boolean) => void;
  buttonType: any | null;
  blog: IBlog | null;
  setBlog: (blog: IBlog | null) => void;
}) => {
  const { mutate } = useSWRConfig();
  const [id, setId] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [content, setContent] = useState<string>("");
  useEffect(() => {
    if (buttonType === "add") {
      setId(0);
      setTitle("");
      setContent("");
      setAuthor("");
    } else if (blog && blog.id) {
      setId(blog.id);
      setTitle(blog.title);
      setContent(blog.content);
      setAuthor(blog.author);
    }
  }, [buttonType, blog]);
  const handleSubmit = () => {
    const showToast = async (icon: SweetAlertIcon, title: string) => {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        iconColor: "white",
        customClass: {
          popup: "colored-toast",
        },
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      await Toast.fire({
        icon,
        title,
      });
    };
    if (!title) {
      (async () => {
        await showToast("error", "Missing input title");
      })();
      return;
    }
    if (!author) {
      (async () => {
        await showToast("error", "Missing input author");
      })();
      return;
    }
    if (!content) {
      (async () => {
        await showToast("error", "Missing input content");
      })();
      return;
    }
    if (buttonType === "add") {
      fetch("http://localhost:8000/blogs", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, author, content }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response) {
            (async () => {
              await showToast("success", "Success");
              setShowModal(false);
              mutate("http://localhost:8000/blogs");
            })();
          } else {
            (async () => {
              await showToast("error", "Error");
            })();
          }
        });
    } else if (buttonType === "edit") {
      fetch(`http://localhost:8000/blogs/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, author, content }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response) {
            (async () => {
              await showToast("success", "Update successfully");
              setShowModal(false);
              mutate("http://localhost:8000/blogs");
            })();
          } else {
            (async () => {
              await showToast("error", "Error");
            })();
          }
        });
    } else if (buttonType === "delete") {
      fetch(`http://localhost:8000/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      });
      (async () => {
        await showToast("success", "Delete successfully");
        setShowModal(false);
        mutate("http://localhost:8000/blogs");
      })();
    }
  };
  const handleCloseDialog = () => {
    setTitle("");
    setAuthor("");
    setContent("");
    setBlog(null);
    setShowModal(false);
  };
  return (
    <div>
      <Dialog
        open={showModal}
        handler={() => setShowModal(false)}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>
          {buttonType === "edit"
            ? "Edit A Blog"
            : buttonType === "delete"
            ? "Delete A Blog"
            : "Add New A Blog"}
        </DialogHeader>
        <DialogBody>
          <div className="grid gap-6">
            <Typography className="-mb-1" color="blue-gray" variant="h6">
              Title
            </Typography>
            <Input
              readOnly={buttonType === "delete"}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              label="Title"
              placeholder="Write here!"
            />
            <Typography className="-mb-1" color="blue-gray" variant="h6">
              Author
            </Typography>
            <Input
              readOnly={buttonType === "delete"}
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
              }}
              label="Author"
              placeholder="Write here!"
            />
            <Typography className="-mb-1" color="blue-gray" variant="h6">
              Content
            </Typography>
            <Textarea
              readOnly={buttonType === "delete"}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
              label="Content"
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => handleCloseDialog()}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          {buttonType !== "view" && (
            <Button
              variant="gradient"
              color={
                buttonType === "edit"
                  ? "amber"
                  : buttonType === "delete"
                  ? "red"
                  : "green"
              }
              onClick={() => handleSubmit()}
            >
              <span>
                {buttonType === "edit"
                  ? "Edit"
                  : buttonType === "delete"
                  ? "Delete"
                  : "Save"}
              </span>
            </Button>
          )}
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default memo(DialogDefault);
