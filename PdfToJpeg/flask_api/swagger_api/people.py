import os
import shutil
from datetime import datetime

from flask import abort, make_response
from pdf2jpg import pdf2jpg


def get_timestamp():
    return datetime.now().strftime(("%Y-%m-%d %H:%M:%S"))


PEOPLE = {
    "Fairy": {
        "fname": "Tooth",
        "lname": "Fairy",
        "timestamp": get_timestamp(),
    },
    "Ruprecht": {
        "fname": "Knecht",
        "lname": "Ruprecht",
        "timestamp": get_timestamp(),
    },
    "Bunny": {
        "fname": "Easter",
        "lname": "Bunny",
        "timestamp": get_timestamp(),
    },
}


def read_all():
    return list(PEOPLE.values())


def create(person):
    lname = person.get("lname")
    fname = person.get("fname", "")

    if lname and lname not in PEOPLE:
        PEOPLE[lname] = {
            "lname": lname,
            "fname": fname,
            "timestamp": get_timestamp(),
        }
        return PEOPLE[lname], 201
    else:
        abort(406, f"Person with last name {lname} already exists")


def read_one(lname):
    if lname in PEOPLE:
        return PEOPLE[lname]
    else:
        abort(404, f"Person with last name {lname} not found")


def update(lname, person):
    if lname in PEOPLE:
        PEOPLE[lname]["fname"] = person.get("fname", PEOPLE[lname]["fname"])
        PEOPLE[lname]["timestamp"] = get_timestamp()
        return PEOPLE[lname]
    else:
        abort(404, f"Person with last name {lname} not found")


def delete(lname):
    if lname in PEOPLE:
        del PEOPLE[lname]
        return make_response(f"{lname} successfully deleted", 200)
    else:
        abort(404, f"Person with last name {lname} not found")


def pdf(pdfpath):
    delete_folder_contents('image_outputs')
    print("[IN-PYTHON. PDF_PATH]" + pdfpath)
    outputpath = "image_outputs"
    inputpath = "pdf_lounge/" + pdfpath

    print("PYTHON OUTPUT PATH: " + outputpath)
    print("PYTHON INPUT PATH: " + inputpath)

    result = pdf2jpg.convert_pdf2jpg(inputpath, outputpath, pages="0")
    print("OUTPUT FILES")
    delete_folder_contents('pdf_lounge')
    return result[0]["output_jpgfiles"]


def delete_folder_contents(folder):

    print('deleted image_outputs')
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))


"""
def pdf(pdfpath):
    delete_folder_contents()
    print("[IN-PYTHON. PDF_PATH]" + pdfpath)
    outputpath = "image_outputs"
    inputpath = "pdf_lounge/" + pdfpath

    print("PYTHON OUTPUT PATH: " + outputpath)
    print("PYTHON INPUT PATH: " + inputpath)

    result = pdf2jpg.convert_pdf2jpg(inputpath, outputpath, pages="0")
    print("OUTPUT FILES")
    return result[0]["output_jpgfiles"]


def delete_folder_contents():
    folder = 'image_outputs'
    print('deleted image_outputs')
    for filename in os.listdir(folder):
        file_path = os.path.join(folder, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (file_path, e))

"""