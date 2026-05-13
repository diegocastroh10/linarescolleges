// Script para actualizar usuario a rol administrador
import('mongoose').then(async (mongoose) => {
  try {
    await mongoose.default.connect('mongodb://admin:Linare$2026@localhost:27017/db-linarescolleges?authSource=admin');
    
    const db = mongoose.default.connection.db;
    const usuariosCollection = db.collection('usuarios');
    
    // Actualizar el usuario a rol administrador
    const result = await usuariosCollection.updateOne(
      { email: 'clublinarescolleges@gmail.com' },
      { 
        $set: { rol: 'administrador' }
      }
    );
    
    console.log('✅ Usuario actualizado:', result.modifiedCount, 'documento(s)');
    
    // Verificar el cambio
    const usuario = await usuariosCollection.findOne({ email: 'clublinarescolleges@gmail.com' });
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
