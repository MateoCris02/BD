import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDIjSPQNaSS6aFcCiIzJnwC3yciUIgoBp8",
    authDomain: "miproyectonosql-35187.firebaseapp.com",
    projectId: "miproyectonosql-35187",
    storageBucket: "miproyectonosql-35187.appspot.com",
    messagingSenderId: "571502707574",
    appId: "1:571502707574:web:7c21901cf4225b37e17057",
    measurementId: "G-FJ1E8QH90M"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para agregar un usuario
document.getElementById('crearUsuarioForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const edad = parseInt(document.getElementById('edad').value);
    const email = document.getElementById('email').value;

    const editingUserId = document.getElementById('crearUsuarioForm').getAttribute('data-user-id');

    if (editingUserId) {
        // Si estamos editando un usuario
        try {
            await updateDoc(doc(db, 'Usuarios', editingUserId), {
                nombre: nombre,
                edad: edad,
                email: email
            });
            Swal.fire('Éxito', 'Usuario actualizado exitosamente', 'success');
        } catch (error) {
            console.error('Error al actualizar usuario: ', error);
            Swal.fire('Error', 'Error al actualizar usuario', 'error');
        }
    } else {
        // Si estamos agregando un nuevo usuario
        try {
            await addDoc(collection(db, 'Usuarios'), {
                nombre: nombre,
                edad: edad,
                email: email
            });
            Swal.fire('Éxito', 'Usuario agregado exitosamente', 'success');
        } catch (error) {
            console.error('Error al agregar usuario: ', error);
            Swal.fire('Error', 'Error al agregar usuario', 'error');
        }
    }

    // Limpiar el formulario y ocultar el modal
    document.getElementById('crearUsuarioForm').reset();
    document.getElementById('crearUsuarioForm').removeAttribute('data-user-id');
    const modal = bootstrap.Modal.getInstance(document.getElementById('crearUsuarioModal'));
    modal.hide();

    cargarUsuarios();
});

// Función para cargar usuarios desde Firebase
async function cargarUsuarios() {
    const listaUsuarios = document.getElementById('listaUsuarios').getElementsByTagName('tbody')[0];
    listaUsuarios.innerHTML = '';

    const snapshot = await getDocs(collection(db, 'Usuarios'));
    snapshot.forEach(doc => {
        const user = doc.data();
        const row = listaUsuarios.insertRow();
        row.innerHTML = `
            <td>${doc.id}</td>
            <td>${user.nombre}</td>
            <td>${user.edad}</td>
            <td>${user.email}</td>
            <td>
                <button class="btn btn-warning" onclick="abrirModalEditar('${doc.id}', '${user.nombre}', ${user.edad}, '${user.email}')">Editar</button>
                <button class="btn btn-danger" onclick="eliminarUsuario('${doc.id}')">Eliminar</button>
            </td>
        `;
    });
}

// Función para eliminar usuario
async function eliminarUsuario(id) {
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo'
    });

    if (result.isConfirmed) {
        try {
            await deleteDoc(doc(db, 'Usuarios', id));
            Swal.fire('Eliminado', 'Usuario eliminado exitosamente', 'success');
            cargarUsuarios();
        } catch (error) {
            console.error('Error al eliminar usuario: ', error);
            Swal.fire('Error', 'Error al eliminar usuario', 'error');
        }
    }
}

// Función para abrir el modal y cargar datos del usuario para editar
function abrirModalEditar(id, nombre, edad, email) {
    document.getElementById('nombre').value = nombre;
    document.getElementById('edad').value = edad;
    document.getElementById('email').value = email;

    // Establecer el ID del usuario en un atributo del formulario
    document.getElementById('crearUsuarioForm').setAttribute('data-user-id', id);
    
    // Cambiar el título del modal
    document.getElementById('crearUsuarioModalLabel').innerText = 'Editar Usuario';

    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('crearUsuarioModal'));
    modal.show();
}

// Cargar usuarios al iniciar
cargarUsuarios();

// Hacer funciones accesibles desde el ámbito global
window.eliminarUsuario = eliminarUsuario;
window.abrirModalEditar = abrirModalEditar;
