import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // Obtener el token del header de autorización
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No se proporcionó un token o el formato es incorrecto.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Adjuntar el ID del usuario a la solicitud para usarlo en las rutas protegidas
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'El token ha expirado.' });
    }
    return res.status(401).json({ message: 'Token inválido.' });
  }
};

export default authMiddleware;
