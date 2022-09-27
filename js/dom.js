const UNCOMPLETED_LIST_BOOKSHELF_ID = "bookshelfs";
const COMPLETED_LIST_BOOKSHELF_ID = "completed-bookshelfs";
const bookshelf_ITEMID = "itemId";

function makeBookshelf(title, author, year, isCompleted) {

    const textTitle = document.createElement("h1");
    textTitle.innerText = title;

    const textAuthor= document.createElement("h2");
    textAuthor.innerText = author;

    const textYear= document.createElement("h3");
    textYear.innerText = year;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner")
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement("div");
    container.classList.add("item", "shadow")
    container.append(textContainer);

    if (isCompleted) {
        container.append(
            createUndoButton(),
            createTrashButton()
        );
    } else {
        container.append(
            createCheckButton(),
            createTrashButton()
        );
    }

    return container;
}

function createUndoButton() {
    return createButton("undo-button", function (event) {
        undoBookFromCompleted(event.target.parentElement);
    });
}

function createTrashButton() {
    return createButton("trash-button", function (event) {
        removeBookFromCompleted(event.target.parentElement);
    });
}

function createCheckButton() {
    return createButton("check-button", function (event) {
        addBookToCompleted(event.target.parentElement);
    });
}

function createButton(buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.addEventListener("click", function (event) {
        eventListener(event);
        event.stopPropagation();
    });
    return button;
}

function clearFields() {
    document.getElementById("title").value = '';
    document.getElementById("author").value = '';
    document.getElementById("year").value = '';
}

function showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#form');
    container.insertBefore(div, form);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
}

function addBookshelf() {
    const uncompletedbookshelfList = document.getElementById(UNCOMPLETED_LIST_BOOKSHELF_ID);
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const year = document.getElementById("year").value;

    const bookshelf = makeBookshelf(title, author, year, false);
    const bookshelfObject = composeBookshelfObject(title, author, year, false);
    
    bookshelf[bookshelf_ITEMID] = bookshelfObject.id;
    bookshelfs.push(bookshelfObject);

    uncompletedbookshelfList.append(bookshelf);
    updateDataToStorage();
    showAlert('Buku berhasil ditambahkan', 'success');
    clearFields();
}

function addBookToCompleted(bookElement) {
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOKSHELF_ID);
    const bookTitle = bookElement.querySelector(".inner > h1").innerText;
    const bookAuthor = bookElement.querySelector(".inner > h2").innerText;
    const bookYear = bookElement.querySelector(".inner > h3").innerText;

    const newbookshelf = makeBookshelf(bookTitle, bookAuthor, bookYear, true);

    const bookshelf = findBookshelf(bookElement[bookshelf_ITEMID]);
    bookshelf.isCompleted = true;
    newbookshelf[bookshelf_ITEMID] = bookshelf.id;

    listCompleted.append(newbookshelf);
    bookElement.remove();

    updateDataToStorage();
    showAlert('Status buku berhasil diupdate', 'success');
}

function removeBookFromCompleted(bookElement) {

    const removeConfirmMessage = 'Apakah Anda yakin ingin hapus buku?';
    removeConfirm = confirm(removeConfirmMessage);
    if (removeConfirm) {
        const bookshelfPosition = findBookshelfIndex(bookElement[bookshelf_ITEMID]);
        bookshelfs.splice(bookshelfPosition, 1);
        bookElement.remove();
        updateDataToStorage();
        showAlert('Buku berhasil dihapus', 'success');
    }
}

function undoBookFromCompleted(bookElement) {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOKSHELF_ID);
    const bookTitle = bookElement.querySelector(".inner > h1").innerText;
    const bookAuthor = bookElement.querySelector(".inner > h2").innerText;
    const bookYear = bookElement.querySelector(".inner > h3").innerText;
    
    const newbookshelf = makeBookshelf(bookTitle, bookAuthor, bookYear, false);

    const bookshelf = findBookshelf(bookElement[bookshelf_ITEMID]);
    bookshelf.isCompleted = false;
    newbookshelf[bookshelf_ITEMID] = bookshelf.id;

    listUncompleted.append(newbookshelf);
    bookElement.remove();
    
    updateDataToStorage();
    showAlert('Status buku berhasil diupdate', 'success');
}

function refreshDataFromBookshelfs() {
    const listUncompleted = document.getElementById(UNCOMPLETED_LIST_BOOKSHELF_ID);
    let listCompleted = document.getElementById(COMPLETED_LIST_BOOKSHELF_ID);

    for(bookshelf of bookshelfs){
        const newbookshelf = makeBookshelf(bookshelf.title, bookshelf.author, bookshelf.year, bookshelf.isCompleted);
        newbookshelf[bookshelf_ITEMID] = bookshelf.id;

        if(bookshelf.isCompleted){
            listCompleted.append(newbookshelf);
        } else {
            listUncompleted.append(newbookshelf);
        }
    }
}