// Script para actualizar contraseña del administrador
import('bcryptjs').then(async (bcrypt) => {
  import('mongoose').then(async (mongoose) => {
    try {
      await mongoose.default.connect('mongodb://admin:Linare$2026@localhost:27017/db-linarescolleges?authSource=admin');
      
      const db = mongoose.default.connection.db;
      const usuariosCollection = db.collection('usuarios');
      
      // Encriptar nueva contraseña
      const salt = await bcrypt.default.genSalt(10);
      const hashedPassword = await bcrypt.default.hash('Admin2024#', salt);
      
      // Actualizar contraseña
      const result = await usuariosCollection.updateOne(
        { email: 'clublinarescolleges@gmail.com' },
        { 
          $set: { password: hashedPassword }
        }
      );
      
      console.log('✅ Contraseña actualizada:', result.modifiedCount, 'documento(s)');
      console.log('Nueva contraseña: Admin2024#');
      
      await mongoose.default.connection.close();
      console.log('✅ Conexión cerrada');
    } catch (error) {
      console.error('❌ Error:', error);
      process.exit(1);
    }
  });
});
