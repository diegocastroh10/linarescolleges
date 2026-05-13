// Script para actualizar el rol del administrador a superadmin
import('mongoose').then(async (mongoose) => {
  try {
    await mongoose.default.connect('mongodb://admin:Linare$2026@localhost:27017/db-linarescolleges?authSource=admin');
    
    const db = mongoose.default.connection.db;
    const usuariosCollection = db.collection('usuarios');
    
    // Actualizar el usuario administrador
    const result = await usuariosCollection.updateOne(
      { email: 'diegocastroh10@hotmail.com' },
      { 
        $set: { rol: 'superadmin' },
        $unset: { isAdmin: '' }
      }
    );
    
    console.log('✅ Usuario actualizado:', result.modifiedCount, 'documento(s)');
    
    // Verificar el cambio
    const usuario = await usuariosCollection.findOne({ email: 'diegocastroh10@hotmail.com' });
    console.log('Usuario actualizado:', {
      email: usuario.email,
      nombreUsuario: usuario.nombreUsuario,
      rol: usuario.rol
    });
    
    await mongoose.default.connection.close();
    console.log('✅ Conexión cerrada');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
});
